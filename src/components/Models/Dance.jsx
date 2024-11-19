import React, { useEffect, useRef } from 'react';
import { useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

export function Dance(props) {
  const group = useRef();
  const modelPath = process.env.NODE_ENV === 'production'
    ? '/projet-raug-xr/dance.glb'
    : '/dance.glb';
  const { scene, animations } = useGLTF(modelPath);
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const actionKeys = Object.keys(actions);
    if (actionKeys.length > 0) {
      actions[actionKeys[0]].play();
    }
  }, [actions, clone]);

  Object.values(materials).forEach(material => {
    material.depthWrite = true;
    material.depthTest = true;
    material.needsUpdate = true;
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Armature" scale={0.01}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh name="Ch16_Body1" geometry={nodes.Ch16_Body1.geometry} material={materials.Ch16_Body} skeleton={nodes.Ch16_Body1.skeleton} />
        <skinnedMesh name="Ch16_Cap" geometry={nodes.Ch16_Cap.geometry} material={materials.Ch16_body1} skeleton={nodes.Ch16_Cap.skeleton} />
        <skinnedMesh name="Ch16_Eyelashes" geometry={nodes.Ch16_Eyelashes.geometry} material={materials.Ch16_eyelashes} skeleton={nodes.Ch16_Eyelashes.skeleton} />
        <skinnedMesh name="Ch16_Mask" geometry={nodes.Ch16_Mask.geometry} material={materials.Ch16_body1} skeleton={nodes.Ch16_Mask.skeleton} />
        <skinnedMesh name="Ch16_Pants" geometry={nodes.Ch16_Pants.geometry} material={materials.Ch16_Body} skeleton={nodes.Ch16_Pants.skeleton} />
        <skinnedMesh name="Ch16_Shirt" geometry={nodes.Ch16_Shirt.geometry} material={materials.Ch16_Body} skeleton={nodes.Ch16_Shirt.skeleton} />
        <skinnedMesh name="Ch16_Shoes" geometry={nodes.Ch16_Shoes.geometry} material={materials.Ch16_body1} skeleton={nodes.Ch16_Shoes.skeleton} />
      </group>
    </group>
  );
}

useGLTF.preload('/dance.glb');