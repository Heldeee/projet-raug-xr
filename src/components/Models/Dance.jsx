import * as THREE from 'three';
import React, { useState, useEffect, useRef } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export function Dance() {
    const fbxLoader = useRef(new FBXLoader());
    const [model, setModel] = useState(null);
    const mixer = useRef(null);

    useEffect(() => {
        const path = process.env.NODE_ENV === 'production'
            ? '/projet-raug-xr/GangnamStyle.fbx'
            : '/GangnamStyle.fbx';
        fbxLoader.current.load(
            path,
            (object) => {
                setModel(object);
                mixer.current = new THREE.AnimationMixer(object);
                const action = mixer.current.clipAction(object.animations[0]);
                action.play();
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            (error) => {
                console.log(error);
            }
        );
    }, []);

    useEffect(() => {
        if (!mixer.current) return;

        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            mixer.current.update(delta);
        };
        animate();
    }, [model]);

    return (
        <group>
            {model && <primitive object={model} />}
        </group>
    );
};