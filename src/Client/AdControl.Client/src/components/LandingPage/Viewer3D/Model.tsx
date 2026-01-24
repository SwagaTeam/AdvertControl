import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
    url: string;
}

export const Model: React.FC<ModelProps> = ({ url }) => {
    const { scene } = useGLTF(url);
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.8;
        }
    });

    return (
        <group ref={groupRef}>
            <Center>
                <primitive object={scene} />
            </Center>
        </group>
    );
};
