import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { RootState } from '../../store/reducers'
import Loader from './loader'

const Section = styled.section`
  display: flex;
  align-items: center;
  background-color: #9669ED;
  padding: 5px;
  border-radius: 5px;
  color: #ffff;
`
const Span = styled.span`
  display: inline-block;
  margin-right: 10px;
`
export const Web3Status = () => {
  const allTransaction: any[] = useSelector((state: RootState) => state.allTransaction);
  const loads = allTransaction.filter(item => item.load).length
  return (
    <Section>
      <Span>{loads} Pending</Span>
      <Loader stroke="white" />
    </Section>
  )
}