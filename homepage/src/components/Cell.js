import React from 'react'
import PropTypes from 'prop-types'
import { Container } from '@mantine/core';
import { Grid } from '@mantine/core';

const Cell = ({size, text, style, borders}) => {
  var styling = ""
  if (borders[0] !== 1){
    styling += " border-t"
  }
  if (borders[1] !== 1){
    styling += " border-b"

  }
  if (borders[2] !== 1){
    styling += " border-l"

  }
  if (borders[3] !== 1){
    styling += " border-r"

  }


  return (
    <Grid.Col sx={{"height": size}} span={1} className={"border-slate-400  " + style + styling}>
      {text}
    </Grid.Col>
  )
}

export default Cell
