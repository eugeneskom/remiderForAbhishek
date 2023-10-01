import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
function Header({onBtnClick}) {
  return (
    <div className="header">
      <Navbar expand="lg" className="bg-body-tertiary p-3 mb-3">
        <Container fluid>
          <Button onClick={onBtnClick}>Add a reminder +</Button>
        </Container>
      </Navbar>
    </div>
  )
}

export default Header