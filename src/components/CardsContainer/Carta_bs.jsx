import './styles.css'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

function Carta_bs({ id, name, involved_companies, cover, price }) {
    

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="src/assets/espada.png" />
            <Card.Body>
                <Card.Title>Espada</Card.Title>
                <Card.Text>
                    Espapda de acero de doble mano
                </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroup.Item className='d-flex'><img className='carta-icon' src='src/assets/espada-icon.png' /> <p className='carta-info'>4 - 6</p></ListGroup.Item>
                <ListGroup.Item className='d-flex'><img className='carta-icon' src='src/assets/mana-icon.png' /> <p className='carta-info'>7</p></ListGroup.Item>
                <ListGroup.Item className='d-flex'><img className='carta-icon' src='src/assets/corazon-icon.png' /> <p className='carta-info'>20</p></ListGroup.Item>
            </ListGroup>
        </Card>
    );
}

export default Carta_bs;