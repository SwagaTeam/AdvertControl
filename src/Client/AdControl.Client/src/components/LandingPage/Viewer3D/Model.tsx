import React, {useEffect, useRef} from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
    url: string;
}

export const Model: React.FC<ModelProps> = ({ url }) => {
    const { scene, animations } = useGLTF(url);
    const groupRef = useRef<THREE.Group>(null);
    const { actions, names } = useAnimations(animations, groupRef);

    useEffect(() => {
        actions[names[0]]?.reset().play();
    }, [actions, names]);

    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime;

            const smoothRotation = Math.sin(time) * 0.4 - 1.57;

            groupRef.current.rotation.y =
                THREE.MathUtils.lerp(groupRef.current.rotation.y, smoothRotation, 0.1);
        }
    });

    return (
        <group ref={groupRef} dispose={null}>
            <Center>
                <primitive object={scene} position={[0, -0.37, 0]}/>
            </Center>
        </group>
    );
};
