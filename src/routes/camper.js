import React, {Component} from 'react'
import styled from 'react-emotion'
import {message, Spin} from 'antd'

import {app} from '../core/fire'

const Backdrop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-image: linear-gradient(rgb(105, 115, 173), rgb(107, 201, 233));
  background-attachment: fixed;

  width: 100%;
  min-height: 100vh;

  padding: 0 2em;
`

const Paper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 3.2em;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 3px 18.5px 2px;

  width: 100%;
  padding: 1.8em 2.2em;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.94);
`

const Heading = styled.h1`
  margin: 0.5em 0;

  font-size: 2.2em;
  color: #333;
`

const SubHeading = styled.h2`
  margin: 0;
  color: #555;
`

const Character = styled.img`
  width: 11em;
  margin-top: -5em;
`

const db = app.firestore()

const getCharacter = major => require(`../assets/${major}.svg`)

class Camper extends Component {
  state = {}

  async componentDidMount() {
    try {
      const {phone} = this.props.match.params

      const snap = await db
        .collection('karma')
        .where('phone', '==', phone)
        .get()

      if (snap.empty) {
        message.error(`ไม่พบแคมเปอร์ในระบบ`)
        return
      }

      snap.docs[0].ref.onSnapshot(s => {
        const record = s.data()
        console.log(`[+] Record Synchronized:`, record)

        if (record.points > this.state.points) {
          const givenPoints = record.points - this.state.points

          message.success(`Points Given: ${givenPoints}`)
        }

        if (record.spent > this.state.spent) {
          const spentPoints = record.spent - this.state.spent

          message.warn(`Points Taken: ${spentPoints}`)
        }

        this.setState(record)
      })
    } catch (err) {
      console.warn(err)
    }
  }

  render() {
    const {phone} = this.props.match.params
    const {id, firstName, lastName, major, points, spent} = this.state

    if (!id) {
      return (
        <Backdrop>
          <Paper>
            <Spin />
          </Paper>
        </Backdrop>
      )
    }

    return (
      <Backdrop>
        <Character src={getCharacter(major)} />
        <Paper>
          <SubHeading>
            {firstName} {lastName}
          </SubHeading>

          <Heading>
            แต้มบุญ {points - spent} <small>J</small>
          </Heading>

          <SubHeading>
            ใช้จ่ายไปแล้ว {spent} <small>J</small>
          </SubHeading>

          <SubHeading>
            แต้มบุญที่ได้ {points} <small>J</small>
          </SubHeading>
        </Paper>
      </Backdrop>
    )
  }
}

export default Camper
