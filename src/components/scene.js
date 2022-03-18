import React, { Suspense, useEffect, useRef, useState }  from 'react';
import { Canvas } from '@react-three/fiber';
import { useControl } from "react-three-gui"
import { OrbitControls, TransformControls, Effects } from "@react-three/drei"
import { Button, Stack, Text } from '@chakra-ui/react';


function Box(props) {
    const orbit = useRef()
    const transform = useRef()
     
    useEffect(() => {
      if (transform.current) {
        const controls = transform.current
        controls.setMode(props.trans)
        const callback = event => (orbit.current.enabled = !event.value)
        controls.addEventListener("dragging-changed", callback)
        return () => controls.removeEventListener("dragging-changed", callback)
      }
    })


    return (
        <>
        <TransformControls ref={transform}>
          <group>
            <mesh 
            rotation={props.value.rotation} 
            scale={props.value.random} 
            position={[props.value.position[0], 0, 0]}
            onPointerOver={(e) => e.object.color = "red"}
            onClick={(e) => {
              }}>
              <boxGeometry args={[1.5,1.5,1.5]}/>
              <meshStandardMaterial color={ props.value.color } />
            </mesh>
        </group>
      </TransformControls>
      <OrbitControls ref={orbit} />
      
      </>
    )
  }

export default function Scene(props) {
  const mode1 = useControl("Scale", { type: "select", items: ["scale"] })
  const mode2 = useControl("Rotation", { type: "select", items: ["rotate"] })
  const mode3 = useControl("Position", { type: "select", items: ["translate"] })

  const [trans, setTrans] = useState(mode1)

  const tranScale = () =>{
    setTrans(mode1)
  }

  const tranRotate = () =>{
    setTrans(mode2)
  }

  const tranPos = () =>{
    setTrans(mode3)
  }

    return (
        <>
       
        <Canvas camera={{ position: [0, 0, 20], fov:40 }}>
          <color attach="background" args={['#808080']} />
          <ambientLight intensity={1} />
          <spotLight
            penumbra={1}
            angle={1}
            castShadow
            position={[10, 60, -5]}
            intensity={8}
            shadow-mapSize={[512, 512]}
          />
          <Suspense fallback={null}>
         
          <group>
            {props.value.map((Data, i) => (
            <Box key={i} value={Data} trans={trans}/>
          ))}
         </group>
         <Effects />
          </Suspense>

        </Canvas>

        <Stack spacing={2} direction='row' align='center'>
          <Text>Change adjustment mode</Text>
           <Button onClick={tranScale} >Scale</Button>
           <Button onClick={tranRotate}>Rotate</Button>
           <Button onClick={tranPos}>Position</Button>
        </Stack>
        </>
        
    )
}