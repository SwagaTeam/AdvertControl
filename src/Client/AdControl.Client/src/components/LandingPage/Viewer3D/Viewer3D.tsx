import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Model } from './Model';

interface Viewer3DProps {
    url: string;
    className?: string;
}

export default function Viewer3D({ url, className } : Viewer3DProps)  {
    return (
        <div className={className} style={{ width: '1200px', height: '700px', position: 'relative', marginTop: "70px"  }}>
            <Canvas
                shadows
                camera={{ position: [0, 0, 20], fov: 45 }}
                gl={{ antialias: true }}
            >
                <ambientLight intensity={0.5}/>
                <pointLight position={[10, 0, 10]} intensity={1}/>
                <spotLight position={[-10, 0, 10]} angle={0.15} penumbra={1}/>

                <Suspense fallback={null}>
                    <Model url={url} />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
};
