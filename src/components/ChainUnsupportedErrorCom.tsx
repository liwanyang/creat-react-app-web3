import styled from 'styled-components'

const Section = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F35454;
  padding:10px 0px;
  color: #ffff;
`
const Text = styled.span`
  font-size: 14px;
`
export const ChainUnsupportedErrorCom = () => {
  return (
    <Section>
      <Text>此网络不支持当前项目。请切换到主网</Text>
    </Section>
  )
}