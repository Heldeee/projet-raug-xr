import * as THREE from "three";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { ContactShadows, useFBX } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Body } from "./components/Models/Body";
import { Dance } from "./components/Models/Dance";
import {
  XR,
  ARButton,
} from '@react-three/xr';
import './App.css';

const capitalize = (str) => str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

const bodyParts = {
  Skin: { Surface: ["skin"] },
  "Nervous System": {
    "Central Nervous System": ["brain", "spinal_cord"],
    "Sensory Organs": ["eyes"]
  },
  Skeleton: {
    "Upper Body": ["spine", "pelvis"],
    "Lower Body": ["legs", "rectus_femoris"]
  },
  Torso: {
    "Respiratory System": ["lung", "bronchus"],
    "Digestive System": ["liver", "pancreas"],
    "Urinary System": ["kidney"]
  },
  Abdomen: {
    "Digestive System": ["sm_intestine", "lg_intestine", "cystic_duct", "gallbladder", "spleen"],
    "Urinary System": ["urinary_bladder", "ureter", "urethra"],
    "Immune System": ["lymph_node", "thymus"]
  },
  Neck: {
    "Respiratory System": ["larynx", "trachea"],
    "Immune System": ["palatine_tonsil"],
    "Other": ["hyoid", "cricoarytenoid"]
  },
  "Reproductive System": { "Male": ["prostate"] },
  "Vascular System": { "Heart and Blood Vessels": ["heart", "blood_vasculature"] }
};

const useBackgroundSound = (mp3) => {
  const [isSoundActive, setIsSoundActive] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load(mp3, (buffer) => {
      audio.setBuffer(buffer);
      audio.setLoop(true);
      audio.setVolume(0.5);
      audioRef.current = audio;
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current = null;
      }
    };
  }, [mp3]);

  const toggleSound = () => {
    if (audioRef.current) {
      if (isSoundActive) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsSoundActive(!isSoundActive);
    }
  };

  return { isSoundActive, toggleSound };
};


const Index = () => {
  const [visibility, setVisibility] = useState(
    Object.fromEntries(
      Object.values(bodyParts).flatMap(subCategories =>
        Object.values(subCategories).flatMap(parts =>
          parts.map(name => [name, true])
        )
      )
    )
  );

  const [mode, setMode] = useState("free");
  const [hoveredOrgan, setHoveredOrgan] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [danceAnimation, setDanceAnimation] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const toggleVisibility = (part) => {
    if (mode === "free") {
      setVisibility(prev => ({ ...prev, [part]: !prev[part] }));
    } else if (mode === "single") {
      setVisibility(prev => {
        const updatedVisibility = Object.fromEntries(
          Object.keys(prev).map(key => [key, key === part ? true : false])
        );
        return updatedVisibility;
      });
    }
  };
  const { isSoundActive, toggleSound } = useBackgroundSound("background.mp3");

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "free" ? "single" : "free"));
    if (mode === "single") {
      activeAll();
    }
  };

  const activeAll = () => {
    setVisibility(Object.fromEntries(Object.keys(visibility).map(key => [key, true])));
  }

  const activeDancer = () => {
    setDanceAnimation(true);
  }

  // Memoize the lights to prevent re-renders
  const lights = useMemo(() => (
    <>
      <directionalLight
        castShadow
        position={[5, 10, 5]}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <ambientLight intensity={0.5} />
    </>
  ), []);


  return (
    <div className="container">
      <div className="header-container">
        <div className="title">
          <div className="main-title">
            <span>Human</span>
            <span>Body</span>
          </div>
          <span className="sub-title">Explorer</span>
        </div>
        <button onClick={toggleMode}>
          {mode === "free" ? "All" : "Single"}
        </button>
        <div style={{ width: '10px' }}></div>
        <button onClick={toggleSound}>
          {isSoundActive ? (
            <img src="audio.svg" alt="Sound On" />
          ) : (
            <img src="no-sound.svg" alt="Sound Off" />
          )}
        </button>
        <button
          onClick={toggleSidebar}
          className={`toggle-sidebar-btn ${isSidebarOpen ? 'toggle-sidebar-btn-open' : 'toggle-sidebar-btn-closed'}`}
        >
          {isSidebarOpen ? 'Close' : 'Menu'}
        </button>
      </div>
      {hoveredOrgan && (
        <div className="overlay">
          <h1 className="organ-title">{hoveredOrgan?.name}</h1>
        </div>
      )}
      <ARButton className="ar-btn" />
      <Canvas className="canvas-container" shadows>
        <XR referenceSpace="local-floor">
          {lights}
          <Body
            position={[0, 1, -2]}
            visibility={visibility}
            setHoveredOrgan={setHoveredOrgan}
          />
          <Dance
            position={[1, 0, 2]}
            rotation={[Math.PI / 2, 0, Math.PI]}
          />
          <Dance
            position={[-1, 0, 2]}
            rotation={[Math.PI / 2, 0, Math.PI]}
          />
          <ContactShadows />
        </XR>
      </Canvas>
      <aside className={`sidebar sidebar-minimal ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {Object.entries(bodyParts).map(([category, subCategories]) => (
          <div key={category} className="category">
            <h3 className="category-title">{category}</h3>
            <hr className="category-divider" />
            {Object.entries(subCategories).map(([subCategory, parts]) => (
              <div key={subCategory} className="subcategory">
                <h4 className="subcategory-title">{subCategory}</h4>
                <div className="parts-grid">
                  {parts.map((part) => (
                    <div
                      key={part}
                      onClick={() => toggleVisibility(part)}
                      className={`part-button ${visibility[part] ? 'part-button-visible' : 'part-button-hidden'}`}
                    >
                      {capitalize(part)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </aside>
    </div>
  );
};

export default Index;
