import './App.css';
import Cell from './components/Cell.js'
import { Grid } from '@mantine/core';
import { MantineProvider } from '@mantine/core';
import { useState, useEffect } from 'react'
import { Container } from '@mantine/core';
import Carousel from 'react-bootstrap/Carousel'
import { Center } from '@mantine/core';
import { Text } from '@mantine/core';
import { SimpleGrid } from '@mantine/core';

function App() {
  var rows = [];
  const [size, set_size] = useState(25);
  const [states, set_states] = useState([])
  const [change_state, set_change_state] = useState(false);
  var w = Math.floor(window.innerWidth / size);
  var h = Math.ceil(window.innerHeight/(w));
  var change_state_local = false
  var init_colour = "bg-stone-800"
  var changed_colour = "bg-stone-900"
  var pointer_colour = "bg-stone-600"

  useEffect(() => {
    var init_states = []
    let tmp_states = []
    for (var i = 0; i < h ; i++) {
      for (var j = 0; j < size; j++) {
        tmp_states.push([{
                          "borders": [0,0,0,0],
                          "style": init_colour,
                          "key":  i + ":" + j,
                          "visited": false
                        }])
      }
        init_states.push(tmp_states)
        tmp_states = []
    }
    set_states(init_states)

  }, []);

  useEffect(() => {
    if (states.length !== 0){
      generate_maze()
    }
  }, [states]);

  function update_state(input){
      set_states(input)
      change_state_local = !change_state_local
      set_change_state(change_state_local)


  }

  async function generate_maze(){
    let finished = false
    let path = []
    console.log("begin gen")
    let maze_board = states
    let start_point = [randomInt(1,h-2),randomInt(1, size / 2)]
    path.push([start_point[0], start_point[1]])
    update_state(maze_board)
    await sleep(100);
    let coordinates = [start_point[0], start_point[1]]

    while (path.length > 0){
      let next_tile = checkAdjacent(coordinates)
      let prev_style = states[coordinates[0]][coordinates[1]][0]["style"]
      maze_board[coordinates[0]][coordinates[1]][0]["visited"] = true
      if (next_tile !== 0){
        maze_board[coordinates[0]][coordinates[1]][0]["style"] = pointer_colour
        breakWall(coordinates, next_tile[1], maze_board)
        update_state(maze_board)
        await(sleep(150))
        if (prev_style === init_colour){
          maze_board[coordinates[0]][coordinates[1]][0]["style"] = changed_colour
        }
        else{
          maze_board[coordinates[0]][coordinates[1]][0]["style"] = prev_style
        }
        coordinates = next_tile[0]
        path.push([coordinates[0], coordinates[1]])
      }
      else{
        maze_board[coordinates[0]][coordinates[1]][0]["style"] = pointer_colour
        update_state(maze_board)
        await(sleep(150))
        console.log(prev_style)
        maze_board[coordinates[0]][coordinates[1]][0]["style"] = changed_colour
        next_tile = path.pop()
        coordinates = [next_tile[0], next_tile[1]]
      }

    }
    update_state(maze_board)
  }

  function checkAdjacent(coordinates){
    let possible_tiles = []
    if (coordinates[0] > 1){
      if (states[coordinates[0] - 1][coordinates[1]][0]["visited"] !== true){
        possible_tiles.push([[(coordinates[0] - 1),(coordinates[1])],"up"])
      }
    }

    if (coordinates[0] < h-2){
      if (states[coordinates[0] + 1][coordinates[1]][0]["visited"] !== true){
        possible_tiles.push([[(coordinates[0] + 1),(coordinates[1])],"down"])
      }
    }

    if (coordinates[1] > 1){
      if (states[coordinates[0]][coordinates[1] - 1][0]["visited"] !== true){
        possible_tiles.push([[(coordinates[0]),(coordinates[1] - 1)],"left"])
      }
    }

    if (coordinates[1] < size - 2){
      if (states[coordinates[0]][coordinates[1] + 1][0]["visited"] !== true){
        possible_tiles.push([[(coordinates[0]),(coordinates[1] + 1)],"right"])
      }
    }
    if (possible_tiles.length === 0){
      return 0
    }
    else{
      return possible_tiles[randomInt(0, possible_tiles.length - 1)]
    }
  }

  function breakWall(coordinate, direction, maze_board){
    if (direction === "up"){
      maze_board[coordinate[0]][coordinate[1]][0]["borders"][0] = 1
      maze_board[coordinate[0] - 1][coordinate[1]][0]["borders"][1] = 1
    }
    if (direction === "down"){
      maze_board[coordinate[0]][coordinate[1]][0]["borders"][1] = 1
      maze_board[coordinate[0] + 1][coordinate[1]][0]["borders"][0] = 1
    }
    if (direction === "left"){
      maze_board[coordinate[0]][coordinate[1]][0]["borders"][2] = 1
      maze_board[coordinate[0]][coordinate[1] - 1][0]["borders"][3] = 1
    }
    if (direction === "right"){
      maze_board[coordinate[0]][coordinate[1]][0]["borders"][3] = 1
      maze_board[coordinate[0]][coordinate[1] + 1][0]["borders"][2] = 1
    }
  }

  function randomInt(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }


  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
      <Container style={{"width" : "100%"}} className="fixed left-0 mt-24 right-0 h-full">

          <Container span={4} style={{"width" : "100%"}} className="bg-zinc-900 opacity-[.95] p-10 mb-10">
            <p className="text-center font-mono text-lg">
              Welcome to DaPoliceman.co.uk, a site I use to host my projects!
            </p>
            <p className="text-center font-mono text-lg">
              If you'd like to check out any of my code for these projects you can see it on my <Text variant="link" component="a" href="https://github.com/DaPoliceman/DestinyProjects">github!</Text>
            </p>
          </Container>
          <SimpleGrid cols={2}
                breakpoints={[
            { maxWidth: 755, cols: 2 },
            { maxWidth: 600, cols: 1 },
          ]}>
          <Container  style={{"width" : "100%"}} className="bg-zinc-900/75">
            <p className="text-center font-mono text-xl">
              New Projects
            </p>
            <Carousel className="pt-5">

              <Carousel.Item>
                <a href="https://dapoliceman.co.uk/roll-rater/">
                  <Center className="mb-3">
                    <img
                      className="w-20 pb-32"
                      src="https://bungie.net/common/destiny2_content/icons/DestinyActivityModeDefinition_fb3e9149c43f7a2e8f8b66cbea7845fe.png"
                      alt="roll rater"
                    />
                  </Center>
                  <Carousel.Caption >
                    <p className="text-lg">Roll Rater</p>
                    <p>Using the destiny manifest to rate and export any random roll weapon</p>
                  </Carousel.Caption>
                </a>
              </Carousel.Item>

              <Carousel.Item>
                <a href="https://dapoliceman.co.uk/roll-chaser/">
                  <Center className="mb-3">
                    <img
                      className="w-20 pb-32"
                      src="https://bungie.net/common/destiny2_content/icons/dbf2dd79d085717b0c76b47388e80c47.png"
                      alt="roll chaser"
                    />
                  </Center>
                  <Carousel.Caption >
                    <p className="text-lg">Roll Chaser</p>
                    <p>Used in tandem with roll rater, see the reccomended rolls for weapons</p>
                  </Carousel.Caption>
                </a>
              </Carousel.Item>

              <Carousel.Item>
                <a href="https://dapoliceman.co.uk/vod-info/">
                  <Center className="mb-3">
                    <img
                      className="w-20 pb-32"
                      src="https://bungie.net/common/destiny2_content/icons/5a90815a3600626978102d6c6ba3582f.png"
                      alt="Vow Info"
                    />
                  </Center>
                  <Carousel.Caption >
                    <p className="text-lg">Vod Info</p>
                    <p>Simple page to display information about the vow of the disciple raid</p>
                  </Carousel.Caption>
                </a>
              </Carousel.Item>

            </Carousel>
          </Container>
          <Container style={{"width" : "100%"}} className="bg-zinc-900/75 ">
            <p className="text-center font-mono text-xl">
              Old Projects
            </p>
            <Carousel className="pt-5">

              <Carousel.Item>
                <a href="https://dapoliceman.co.uk/godrollRater/">
                  <Center className="mb-3">
                    <img
                      className="w-20 pb-32"
                      src="https://bungie.net/common/destiny2_content/icons/2565ae54801563abfefd78f8c2dd6463.png"
                      alt="Atheon Callouts"
                    />
                  </Center>
                  <Carousel.Caption >
                    <p className="text-lg">Godroll Rater</p>
                    <p>My first use of authenticated bungie api calls, looks at your inventory and rates your guns</p>
                  </Carousel.Caption>
                </a>
              </Carousel.Item>

              <Carousel.Item>
                <a href="https://dapoliceman.co.uk/AtheonCallouts/">
                  <Center className="mb-3">
                    <img
                      className="w-20 pb-32"
                      src="https://www.bungie.net/common/destiny2_content/icons/6d091410227eef82138a162df73065b9.png"
                      alt="Atheon Callouts"
                    />
                  </Center>
                  <Carousel.Caption >
                    <p className="text-lg">Atheon Callouts</p>
                    <p>My first web dev project, for when your vault of glass runs are going too smoothly</p>
                  </Carousel.Caption>
                </a>
              </Carousel.Item>

              <Carousel.Item>
                <a href="https://dapoliceman.co.uk/isGroundedOn/">
                  <Center className="mb-3">
                    <img
                      className="w-20 pb-32"
                      src="https://www.bungie.net/common/destiny2_content/icons/8c11fd95a108f6680dd030328d04c1bf.png"
                      alt="Atheon Callouts"
                    />
                  </Center>
                  <Carousel.Caption >
                    <p className="text-lg">Is Grounded on</p>
                    <p>My first proper dive into the bungie API, lets you know when the worst modifier is on in strikes</p>
                  </Carousel.Caption>
                </a>
              </Carousel.Item>

            </Carousel>
          </Container>
        </SimpleGrid>
      </Container>

      <Grid columns={size}>
        {
          states.map((rows, i) => {
           return (
            <>
            {
              rows.map((cols,j) => (
                <>
                {<Cell size={w + "px"} key={states[i][j][0]["key"]} style={states[i][j][0]["style"]} text={""} borders={states[i][j][0]["borders"]}> </Cell>}
                </>
              ))
            }
            </>
            )
          })
        }
      </Grid>
    </MantineProvider>
  );
}



export default App;
