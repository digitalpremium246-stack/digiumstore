// src/components/3d/Avatar.tsx
"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AvatarProps {
  skinColor: string;
  clothingColor: string;
  gender: "male" | "female";
}

export function Avatar({ skinColor, clothingColor, gender }: AvatarProps) {
  const group = useRef<THREE.Group>(null);
  
  // Ganti URL ini dengan path ke file .glb Anda di folder public
  // Jika file tidak ada, kita gunakan fallback primitive (Capsule)
  const modelPath = "/models/avatar.glb"; 
  
  // Hook untuk load model. Jika gagal, kita render primitive di bawah.
  // const { nodes, materials } = useGLTF(modelPath);

  // Animasi rotasi otomatis (opsional, selain kontrol manual)
  useFrame((state) => {
    if (group.current) {
      // group.current.rotation.y += 0.005; // Uncomment untuk auto-rotate
    }
  });

  return (
    <group ref={group} dispose={null}>
      {/* 
        ========================================================
        IMPLEMENTASI MODEL GLB ASLI (Aktifkan jika file .glb ada)
        ========================================================
        <primitive object={nodes.Hips} />
        <skinnedMesh 
          geometry={nodes.Body.geometry} 
          material={materials.Body} 
          skeleton={nodes.Body.skeleton} 
        >
          <meshStandardMaterial color={skinColor} />
        </skinnedMesh>
        <skinnedMesh 
          geometry={nodes.Clothing.geometry} 
          material={materials.Clothing} 
          skeleton={nodes.Clothing.skeleton} 
        >
          <meshStandardMaterial color={clothingColor} roughness={0.7} />
        </skinnedMesh>
      */}

      {/* ========================================== */}
      {/* FALLBACK: PRIMITIVE AVATAR (Agar tetap jalan) */}
      {/* ========================================== */}
      <mesh position={[0, 1, 0]} castShadow>
        {/* Badan / Baju */}
        <capsuleGeometry args={[0.4, 0.8, 4, 16]} />
        <meshStandardMaterial color={clothingColor} roughness={0.8} />
      </mesh>
      
      <mesh position={[0, 2.1, 0]} castShadow>
        {/* Kepala */}
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>

      <mesh position={[-0.5, 1.4, 0]} castShadow rotation={[0, 0, -0.2]}>
        {/* Lengan Kiri */}
        <capsuleGeometry args={[0.12, 0.6, 4, 16]} />
        <meshStandardMaterial color={clothingColor} />
      </mesh>
      
      <mesh position={[0.5, 1.4, 0]} castShadow rotation={[0, 0, 0.2]}>
        {/* Lengan Kanan */}
        <capsuleGeometry args={[0.12, 0.6, 4, 16]} />
        <meshStandardMaterial color={clothingColor} />
      </mesh>
      
      <mesh position={[-0.2, 0.2, 0]} castShadow>
        {/* Kaki Kiri */}
        <capsuleGeometry args={[0.15, 0.6, 4, 16]} />
        <meshStandardMaterial color={clothingColor} />
      </mesh>

      <mesh position={[0.2, 0.2, 0]} castShadow>
        {/* Kaki Kanan */}
        <capsuleGeometry args={[0.15, 0.6, 4, 16]} />
        <meshStandardMaterial color={clothingColor} />
      </mesh>
    </group>
  );
}

// Preload model untuk performa (uncomment jika menggunakan GLB)
// useGLTF.preload("/models/avatar.glb");