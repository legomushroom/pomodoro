if ( WEBGL.isWebGLAvailable() === false ) {
            
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );

}

var container, stats, controls;
var camera, scene, renderer;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.25, 20 );
    camera.position.set( 0, 0, 5 );

    controls = new THREE.OrbitControls( camera );
    controls.target.set( 0, - 0.2, - 0.2 );
    controls.update();

    scene = new THREE.Scene();

    var urls = [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ];
    var loader = new THREE.CubeTextureLoader().setPath( 'textures/cube/Bridge2/' );
    loader.load( urls, function ( texture ) {

        texture.encoding = THREE.sRGBEncoding;

        // light probe

        var sh = new THREE.SphericalHarmonics3();
        // Coefficients computed with LightProbeGenerator.fromCubeTexture() and sh.toArray()
        sh.fromArray(
            [ 0.30350402186576847, 0.4695020609740584, 0.6617666153025029,
                0.08320329629560637, 0.17400245533281114, 0.3453152275957874,
                0.12158824672933624, 0.10353622444396401, 0.06530153583524678,
                0.013607857556048842, 0.019188302420841814, 0.01874813525865349,
                0.010822144860690035, 0.01574198289465548, 0.01742654587405097,
                0.06310934215371257, 0.061061933521237545, 0.044428745834389806,
                0.19958014705624538, 0.22020936865062024, 0.19468224569437417,
                0.019647224115989702, 0.032414009820739324, 0.043555315974879015,
                0.13316051440231733, 0.1964793374921572, 0.2189213184804167
            ]
        );
        var lightProbe = new THREE.LightProbe( sh );
        scene.add( lightProbe );

        // model

        var loader = new THREE.GLTFLoader().setPath( 'models/gltf/misc/' );
        
        loader.load( 'suz2.gltf', function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {

                    child.material.envMap = texture;

                }

            } );

            scene.add( gltf.scene );

            const bone = scene.children[1].children[2].children[0];
            const bone2 = bone.children[0];
            // console.log(scene.children[1].children[2].children[0].children[0]);
            
            let x = -225;
            // setInterval(() => {
            // 	bone2.rotation.set(x, 0, 0);
            // 	x += 0.001;
            // }, 16);

        } );

        scene.background = texture;

    } );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2; // approximate sRGB
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    // stats
    stats = new Stats();
    container.appendChild( stats.dom );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    renderer.render( scene, camera );

    stats.update();

}
