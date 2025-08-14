"use client";
import { useEffect, useRef } from 'react';

export function ThreeHeroBackground(){
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    let cleanup: (()=>void)|undefined;
    (async ()=>{
      const THREE = await import('three');
      if(!ref.current) return;
      const container = ref.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 42;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
      const group = new THREE.Group();
      scene.add(group);
      const PARTICLE_COUNT = 420;
      const positions = new Float32Array(PARTICLE_COUNT * 3);
      for(let i=0;i<PARTICLE_COUNT;i++){
        const i3 = i*3; positions[i3] = (Math.random()-0.5)*60; positions[i3+1] = (Math.random()-0.5)*34; positions[i3+2] = (Math.random()-0.5)*60;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
      const material = new THREE.PointsMaterial({ size: 0.9, color: new THREE.Color('#5f6dff'), transparent:true, opacity:0.9 });
      const points = new THREE.Points(geometry, material);
      group.add(points);
      const sphereGeo = new THREE.SphereGeometry(18, 32, 32);
      const sphereMat = new THREE.MeshBasicMaterial({ wireframe: true, color: '#00d5ff', transparent:true, opacity:0.08 });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);
      const mouse = { x:0, y:0 };
      const onPointerMove = (e: PointerEvent)=>{ mouse.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.y = -(e.clientY / window.innerHeight) * 2 + 1; };
      window.addEventListener('pointermove', onPointerMove);
      let frame = 0; let raf:number;
      const animate = ()=>{ frame += 0.004; group.rotation.y += 0.0008; group.rotation.x = Math.sin(frame*0.6)*0.15; group.position.x += (mouse.x*4 - group.position.x) * 0.02; group.position.y += (mouse.y*2 - group.position.y) * 0.02; renderer.render(scene, camera); raf = requestAnimationFrame(animate); };
      animate();
      const onResize = ()=>{ if(!container) return; camera.aspect = container.clientWidth / container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth, container.clientHeight); };
      window.addEventListener('resize', onResize);
      cleanup = ()=>{ window.removeEventListener('resize', onResize); window.removeEventListener('pointermove', onPointerMove); geometry.dispose(); material.dispose(); sphereGeo.dispose(); renderer.dispose(); cancelAnimationFrame(raf); if(container.contains(renderer.domElement)) container.removeChild(renderer.domElement); };
    })();
    return ()=>{ cleanup && cleanup(); };
  },[]);
  return <div ref={ref} className="absolute inset-0 -z-10" aria-hidden="true" />;
}
