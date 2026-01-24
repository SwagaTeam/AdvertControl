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

    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime;

            // Медленное плавное вращение
            const smoothRotation = Math.sin(time) * 0.5 - 1;

            // Плавное движение с lerp
            groupRef.current.rotation.y =
                groupRef.current.rotation.y * 0.25 + smoothRotation * 0.75;
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
