import React, { useEffect,useState }  from 'react';
import { Text, Grid, GridItem  } from '@chakra-ui/react';
import {Html} from '@react-three/drei'
import { Canvas} from '@react-three/fiber'

function SavedBox(props) {
    //console.log(props)
    const [active, setActive] = useState(false)
  
    useEffect(() => {
      if (active === true) {
        props.handleBoxAdd(props.value)
      } else {
        props.handleBoxRemove(props.value)
      }
    }, [active])
  
    return (
      <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 0, 30], fov: 22 }}>
            <ambientLight intensity={1} />
            <spotLight
              penumbra={1}
              angle={1}
              castShadow
              position={[10, 60, -5]}
              intensity={8}
              shadow-mapSize={[512, 512]}
            />
      <mesh 
      rotation={props.value.rotation} 
      scale={active? 3:1} 
      position={ [0, 0 ,0]}
      onPointerOver={(e) => e.object.color = "red"}
      onClick={(e) => {
        setActive(!active)
        }}>
        <boxGeometry args={[2,2,2]}/>
        <meshStandardMaterial color={ props.value.color } />
        
        <Html as='div'>
          <p>{props.value.key}</p>
        </Html>
      </mesh>
      </Canvas>
      
    )
  }
  
  export default function SavedBoxes (props) {
    const [boxes, setBoxes] = useState([])
  
    const handleBoxAdd = (model) =>{
      setBoxes(boxes.concat(model))
    }
  
    const handleBoxRemove = (model) =>{
      setBoxes(boxes.filter(item => item.key !== model.key))
    }
  
    return (
      
      <div onClick={props.handleBoxesSelect(boxes)}>
        <Text fontSize={'3xl'} align='center'>Model List</Text>
        <Grid templateColumns='repeat(5, 1fr)' gap={3}> 
          {props.groups.map((Data, i) => (
            <GridItem key={i}>
            <SavedBox value={Data} handleBoxAdd={handleBoxAdd} handleBoxRemove={handleBoxRemove}/>
            </GridItem>
          ))}
      </Grid>
      </div>
    )
  }