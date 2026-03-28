import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

interface View {
  bottom: number;
  height: number;
  camera?: THREE.PerspectiveCamera;
}

interface SceneData {
  views: View[];
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  light: THREE.PointLight;
  softLight: THREE.AmbientLight;
  modelGroup: THREE.Group;
  w: number;
  h: number;
}

const createScene = (model: THREE.Group): SceneData => {
  const views: View[] = [
    { bottom: 0, height: 1 },
    { bottom: 0, height: 0 }
  ];

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);

  document.body.appendChild(renderer.domElement);

  // scene
  const scene = new THREE.Scene();

  for (let ii = 0; ii < views.length; ++ii) {
    const view = views[ii];
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.fromArray([0, 0, 180]);
    camera.layers.disableAll();
    camera.layers.enable(ii);
    view.camera = camera;
    camera.lookAt(new THREE.Vector3(0, 5, 0));
  }

  // light
  const light = new THREE.PointLight(0xffffff, 0.75);
  light.position.z = 150;
  light.position.x = 70;
  light.position.y = -20;
  scene.add(light);

  const softLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(softLight);

  const edges = new THREE.EdgesGeometry(model.children[0].geometry as THREE.BufferGeometry);
  const line = new THREE.LineSegments(edges);
  line.material.depthTest = false;
  line.material.opacity = 0.5;
  line.material.transparent = true;
  line.position.x = 0.5;
  line.position.z = -1;
  line.position.y = 0.2;

  const modelGroup = new THREE.Group();

  model.layers.set(0);
  line.layers.set(1);

  modelGroup.add(model);
  modelGroup.add(line);
  scene.add(modelGroup);

  return {
    views,
    renderer,
    scene,
    light,
    softLight,
    modelGroup,
    w: window.innerWidth,
    h: window.innerHeight
  };
};

const renderScene = (sceneData: SceneData) => {
  for (let ii = 0; ii < sceneData.views.length; ++ii) {
    const view = sceneData.views[ii];
    const camera = view.camera!;

    const bottom = Math.floor(sceneData.h * view.bottom);
    const height = Math.floor(sceneData.h * view.height);

    sceneData.renderer.setViewport(0, 0, sceneData.w, sceneData.h);
    sceneData.renderer.setScissor(0, bottom, sceneData.w, height);
    sceneData.renderer.setScissorTest(true);

    camera.aspect = sceneData.w / sceneData.h;
    sceneData.renderer.render(sceneData.scene, camera);
  }
};

const handleResize = (sceneData: SceneData) => {
  sceneData.w = window.innerWidth;
  sceneData.h = window.innerHeight;

  for (let ii = 0; ii < sceneData.views.length; ++ii) {
    const view = sceneData.views[ii];
    const camera = view.camera!;
    camera.aspect = sceneData.w / sceneData.h;
    const camZ = (screen.width - sceneData.w * 1) / 3;
    camera.position.z = camZ < 180 ? 180 : camZ;
    camera.updateProjectionMatrix();
  }

  sceneData.renderer.setSize(sceneData.w, sceneData.h);
  renderScene(sceneData);
};

const cleanupScene = (sceneData: SceneData) => {
  if (sceneData.renderer.domElement.parentElement) {
    sceneData.renderer.domElement.parentElement.removeChild(sceneData.renderer.domElement);
  }
  sceneData.renderer.dispose();
};

const PlaneAnimation: React.FC = () => {
  const sceneRef = useRef<SceneData | null>(null);

  useEffect(() => {
    const setupAnimation = (model: THREE.Group) => {
      const sceneData = createScene(model);
      sceneRef.current = sceneData;
      const plane = sceneData.modelGroup;

      // Create resize handler with sceneData
      const onResize = () => handleResize(sceneData);
      
      // Initial resize
      handleResize(sceneData);
      window.addEventListener('resize', onResize, false);

      gsap.fromTo('canvas', { x: '50%', autoAlpha: 0 }, { duration: 1, x: '0%', autoAlpha: 1 });
      gsap.to('.loading', { autoAlpha: 0 });
      gsap.to('.scroll-cta', { opacity: 1 });
      gsap.set('svg', { autoAlpha: 1 });

      const tau = Math.PI * 2;

      gsap.set(plane.rotation, { y: tau * -0.25 });
      gsap.set(plane.position, { x: 80, y: -32, z: -60 });

      renderScene(sceneData);

      const sectionDuration = 1;

      gsap.fromTo(
        sceneData.views[1],
        { height: 1, bottom: 0 },
        {
          height: 0,
          bottom: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.blueprint',
            scrub: true,
            start: 'bottom bottom',
            end: 'bottom top'
          }
        }
      );

      gsap.fromTo(
        sceneData.views[1],
        { height: 0, bottom: 0 },
        {
          height: 1,
          bottom: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.blueprint',
            scrub: true,
            start: 'top bottom',
            end: 'top top'
          }
        }
      );

      gsap.to('.ground', {
        y: '30%',
        scrollTrigger: {
          trigger: '.ground-container',
          scrub: true,
          start: 'top bottom',
          end: 'bottom top'
        }
      });

      gsap.from('.clouds', {
        y: '25%',
        scrollTrigger: {
          trigger: '.ground-container',
          scrub: true,
          start: 'top bottom',
          end: 'bottom top'
        }
      });

      gsap.to('#line-length', {
        drawSVG: 100,
        scrollTrigger: {
          trigger: '.length',
          scrub: true,
          start: 'top bottom',
          end: 'top top'
        }
      });

      gsap.to('#line-wingspan', {
        drawSVG: 100,
        scrollTrigger: {
          trigger: '.wingspan',
          scrub: true,
          start: 'top 25%',
          end: 'bottom 50%'
        }
      });

      gsap.to('#circle-phalange', {
        drawSVG: 100,
        scrollTrigger: {
          trigger: '.phalange',
          scrub: true,
          start: 'top 50%',
          end: 'bottom 100%'
        }
      });

      gsap.to('#line-length', {
        opacity: 0,
        drawSVG: 0,
        scrollTrigger: {
          trigger: '.length',
          scrub: true,
          start: 'top top',
          end: 'bottom top'
        }
      });

      gsap.to('#line-wingspan', {
        opacity: 0,
        drawSVG: 0,
        scrollTrigger: {
          trigger: '.wingspan',
          scrub: true,
          start: 'top top',
          end: 'bottom top'
        }
      });

      gsap.to('#circle-phalange', {
        opacity: 0,
        drawSVG: 0,
        scrollTrigger: {
          trigger: '.phalange',
          scrub: true,
          start: 'top top',
          end: 'bottom top'
        }
      });

      const tl = gsap.timeline({
        onUpdate: () => renderScene(sceneData),
        scrollTrigger: {
          trigger: '.content',
          scrub: true,
          start: 'top top',
          end: 'bottom bottom'
        },
        defaults: { duration: sectionDuration, ease: 'power2.inOut' }
      });

      let delay = 0;

      // Section 1: Hero -> hide scroll CTA, plane enters
      tl.to('.scroll-cta', { duration: 0.25, opacity: 0 }, delay);
      tl.to(plane.position, { x: -10, ease: 'power1.in' }, delay);

      delay += sectionDuration;

      // Section 2: "kinda like buses" -> plane tilts
      tl.to(plane.rotation, { x: tau * 0.25, y: 0, z: -tau * 0.05, ease: 'power1.inOut' }, delay);
      tl.to(plane.position, { x: -40, y: 0, z: -60, ease: 'power1.inOut' }, delay);

      delay += sectionDuration;

      // Section 3: "leave the ground" -> plane banks right
      tl.to(plane.rotation, { x: tau * 0.25, y: 0, z: tau * 0.05, ease: 'power3.inOut' }, delay);
      tl.to(plane.position, { x: 40, y: 0, z: -60, ease: 'power2.inOut' }, delay);

      delay += sectionDuration;

      // Section 4: "fly through the sky"
      tl.to(plane.rotation, { x: tau * 0.2, y: 0, z: -tau * 0.1, ease: 'power3.inOut' }, delay);
      tl.to(plane.position, { x: -40, y: 0, z: -30, ease: 'power2.inOut' }, delay);

      delay += sectionDuration;

      // Section 5: "defying physical laws" -> plane soars upward
      tl.to(plane.rotation, { x: tau * 0.15, y: tau * 0.1, z: tau * 0.02, ease: 'power2.inOut' }, delay);
      tl.to(plane.position, { x: 20, y: 20, z: -50, ease: 'power2.inOut' }, delay);

      delay += sectionDuration;

      // Section 6: "how do they work" -> plane levels out, side view
      tl.to(plane.rotation, { x: 0, z: 0, y: tau * 0.25 }, delay);
      tl.to(plane.position, { x: 0, y: -10, z: 50 }, delay);

      delay += sectionDuration;

      // Section 7: "500+ mph" fun fact -> plane zooms forward
      tl.to(plane.rotation, { x: tau * 0.05, y: tau * 0.3, z: -tau * 0.02, ease: 'power3.inOut' }, delay);
      tl.to(plane.position, { x: -30, y: 5, z: 80, ease: 'power3.inOut' }, delay);

      delay += sectionDuration;

      // Section 8: "35,000 feet" -> plane climbs high
      tl.to(plane.rotation, { x: tau * 0.2, y: tau * 0.35, z: tau * 0.05, ease: 'power2.inOut' }, delay);
      tl.to(plane.position, { x: 30, y: 25, z: 40, ease: 'power2.inOut' }, delay);

      delay += sectionDuration;

      // Section 9: Blueprint "facts & figures" -> frontal approach
      tl.to(plane.rotation, { x: tau * 0.25, y: tau * 0.5, z: 0, ease: 'power4.inOut' }, delay);
      tl.to(plane.position, { z: 30, x: 0, y: 0, ease: 'power4.inOut' }, delay);

      delay += sectionDuration;
      delay += sectionDuration;

      // Section 11: Blueprint length/wingspan
      tl.to(plane.rotation, { x: tau * 0.25, y: tau * 0.5, z: 0, ease: 'power4.inOut' }, delay);
      tl.to(plane.position, { z: 60, x: 30, ease: 'power4.inOut' }, delay);

      delay += sectionDuration;

      // Section 12: Blueprint phalange/engines
      tl.to(plane.rotation, { x: tau * 0.35, y: tau * 0.75, z: tau * 0.6, ease: 'power4.inOut' }, delay);
      tl.to(plane.position, { z: 100, x: 20, y: 0, ease: 'power4.inOut' }, delay);

      delay += sectionDuration;

      // Section 13: Blueprint altitude/passengers
      tl.to(plane.rotation, { x: tau * 0.3, y: tau * 0.6, z: tau * 0.4, ease: 'power3.inOut' }, delay);
      tl.to(plane.position, { z: 70, x: -20, y: 10, ease: 'power3.inOut' }, delay);

      delay += sectionDuration;

      // Section 14: History "brief history" -> plane pulls back
      tl.to(plane.rotation, { x: tau * 0.15, y: tau * 0.85, z: -tau * 0, ease: 'power1.in' }, delay);
      tl.to(plane.position, { z: -150, x: 0, y: 0, ease: 'power1.inOut' }, delay);

      delay += sectionDuration;

      // Section 15: History "1903" -> plane rolls gently
      tl.to(plane.rotation, { x: tau * 0.1, y: tau * 0.9, z: tau * 0.05, ease: 'power2.inOut' }, delay);
      tl.to(plane.position, { z: -100, x: 40, y: -10, ease: 'power2.inOut' }, delay);

      delay += sectionDuration;

      // Section 16: History "Today" -> plane approaches center
      tl.to(plane.rotation, { x: tau * 0.05, y: tau * 0.95, z: -tau * 0.02, ease: 'power2.inOut' }, delay);
      tl.to(plane.position, { z: -50, x: -20, y: 10, ease: 'power2.inOut' }, delay);

      delay += sectionDuration;

      // Section 17-18: Sunset -> plane flies into the distance
      tl.to(plane.rotation, { duration: sectionDuration * 2, x: -tau * 0.05, y: tau, z: -tau * 0.1, ease: 'none' }, delay);
      tl.to(plane.position, { duration: sectionDuration * 2, x: 0, y: 30, z: 320, ease: 'power1.in' }, delay);

      tl.to(sceneData.light.position, { duration: sectionDuration * 2, x: 0, y: 0, z: 0 }, delay);

      // Return cleanup function for this setup
      return () => {
        window.removeEventListener('resize', onResize);
      };
    };

    const loadModel = () => {
      gsap.set('#line-length', { drawSVG: 0 });
      gsap.set('#line-wingspan', { drawSVG: 0 });
      gsap.set('#circle-phalange', { drawSVG: 0 });

      let object: THREE.Group;
      let cleanupAnimation: (() => void) | undefined;

      const onModelLoaded = () => {
        object.traverse((child: any) => {
          const mat = new THREE.MeshPhongMaterial({
            color: 0xE8E8F0,
            specular: 0xffffff,
            shininess: 30,
            flatShading: true
          });
          child.material = mat;
        });

        cleanupAnimation = setupAnimation(object);
      };

      const manager = new THREE.LoadingManager(onModelLoaded);
      manager.onProgress = (item, loaded, total) => console.log(item, loaded, total);

      const loader = new OBJLoader(manager);
      loader.load('https://assets.codepen.io/557388/1405+Plane_1.obj', (obj) => {
        object = obj;
      });

      return cleanupAnimation;
    };

    const cleanupAnimation = loadModel();

    // Cleanup function
    return () => {
      if (cleanupAnimation) {
        cleanupAnimation();
      }
      if (sceneRef.current) {
        cleanupScene(sceneRef.current);
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf('*');
    };
  }, []);

  return <div />;
};

export default PlaneAnimation;