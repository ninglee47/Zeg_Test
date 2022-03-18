import React, { useState, useEffect }  from 'react';
import './App.css';
import { Canvas } from '@react-three/fiber'
import SavedBoxes from './components/savedBoxes';
import Scene from './components/scene';
import { ChakraProvider, Stack, Box, Button, VStack, HStack, Text} from '@chakra-ui/react'


const randomVector = (r, index) => [(index-3)*5 + 2, r / 2 - Math.random() * r , 0]//add range random
const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
const randomColor = () => Math.random() * 0xffffff
const randomData = Array.from({ length: 5 }, (r = 10, index) => ({ key: index += 1, random: Math.random()*2 + 1, position: randomVector(r, index), rotation: randomEuler(), color: randomColor()}))

function getBoxProp(prop) {
  let box = {}
  box["key"] = prop.key
  box["color"] = prop.color
  box["rotation"] = prop.rotation
  box["position"] = prop.position
  box["scale"] = prop.random
  return box
}

function Cube(props) {
  //console.log(props)
  const [active, setActive] = useState(false)
  const model = getBoxProp(props.value)

  useEffect(() => {
    if (active === true) {
      console.log(model)
      props.handleModelAdd(model)
    } else {
      //console.log("Try")
      props.handleModelRemove(model)
    }
  }, [active])

  return (
    <mesh 
    rotation={props.value.rotation} 
    scale={active? props.value.random+ 2:props.value.random} 
    position={props.value.position}
    onClick={(e) => {
      setActive(!active)
      }}>
      <boxGeometry args={[1.2,1.2,1.2]}/>
      <meshStandardMaterial color={ props.value.color } />
    </mesh>
  )
}


function App() {
  const [models, setModels] = useState([]);
  const [groups, setGroups] = useState([]);
  const [boxesSelect, setBoxesSelect] = useState([])
  const [boxScene, setBoxScene] = useState([])
  const [open, setOpen] = useState(false)

  const init = []
  
  
  useEffect(() => {
    console.log("Model", models, "Groups", groups, "BoxSelect", boxesSelect, "Box Scene", boxScene)
  }, [models, groups, open, boxesSelect, boxScene])

  const handleGroupChange = () =>{
    setGroups([...new Set(groups.concat(models).map(item => item))])
    //alert ("All selected items are saved.")
  }

  const handleBoxesSelect = (boxes) =>{
    setBoxesSelect(boxes)
  }

  const handleGroupRemove = () => {
    setGroups(groups.filter(item => !boxesSelect.includes(item)))
    setBoxScene(boxScene.filter(item => !boxesSelect.includes(item)))
    setBoxesSelect(init)
  }

  const handleModelAdd = (model) =>{
      //console.log(models)
      setModels(models.concat(model))
  }
  
  const handleModelRemove = (model) =>{
    setModels(models.filter(item => item.key !== model.key))
  }

  const handleOpenGroup = () => {
     setOpen(!open)
  }

  const handleSceneChange = () =>{
    setBoxScene([...new Set(boxScene.concat(boxesSelect).map(item => item))])
  }


  return (
    <ChakraProvider>
    <div>
      <Text fontSize={'4xl'} align='center'>
        Simple Grouping system
      </Text>
      
      <Stack spacing={2} direction='row' align='center'>
        <Button onClick={handleGroupChange}>
          Save selected models
        </Button>
  
        <Button onClick={handleOpenGroup}>
          Open selected models
        </Button>
  
        <Button onClick={handleGroupRemove}>
          Remove models from list
        </Button>

        <Button onClick={handleSceneChange}>
          Add models to scene
        </Button>

      </Stack>
      
      
      <div id="canvas-container" >
        <VStack  
            spacing={4} align='stretch'>

        <Box h='300px' pb={10}>
        <Text fontSize={'3xl'} align='center'>Models</Text>
        <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 0, 20], fov: 40 }}>
        <ambientLight intensity={1} />
        <spotLight
            penumbra={1}
            angle={1}
            castShadow
            position={[10, 60, -5]}
            intensity={8}
            shadow-mapSize={[512, 512]}
          />
          <group>
            {randomData.map((Data, i) => (
            <Cube key={i} value={Data} handleModelAdd={handleModelAdd} handleModelRemove={handleModelRemove}/>
          ))}
         </group>
        </Canvas>
        </Box>
        
        <Box>
        <HStack spacing='24px'>
          {open? <SavedBoxes groups={groups} handleBoxesSelect={handleBoxesSelect} /> : <></>}
        </HStack>
        </Box>
        
        <Box h='500px'>
          <Text fontSize={'3xl'} align='center'>Scene</Text>
          <Scene value={boxScene}/>
        </Box>

        </VStack>

        
      </div>
    </div>
    </ChakraProvider>
  );
}

export default App;
