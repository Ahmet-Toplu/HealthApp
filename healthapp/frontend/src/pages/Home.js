import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faAddressBook, faRobot, faLightbulb } from '@fortawesome/free-solid-svg-icons';


export const HomePage = () => {
  const navigate = useNavigate();

  const navigateToMap = () => {
    navigate('/map');
  };

  const navigateToForum = () => {
    navigate('/forum');
  };

  const navigateToContact = () => {
    navigate('/contact');
  };

  const navigateToChatBot = () => {
    navigate('/chatbot');
  };

  const navigateToArticles = () => {
    navigate('/articles');
  };

  return (
    <div style={{ paddingTop: '100px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
        <Card style={{ width: '18rem', cursor: 'pointer' }} onClick={navigateToForum}>
        <Card.Body>
            <Card.Title>Forum</Card.Title>
            <Card.Text>
                <FontAwesomeIcon icon={faComments} size="lg" />
            </Card.Text>
        </Card.Body>
        </Card>
        <Card style={{ width: '18rem', cursor: 'pointer' }} onClick={navigateToContact}>
        <Card.Body>
            <Card.Title>Contact</Card.Title>
            <Card.Text>
                <FontAwesomeIcon icon={faAddressBook} size="lg" />
            </Card.Text>
        </Card.Body>
        </Card>
        <Card style={{ width: '18rem', cursor: 'pointer' }} onClick={navigateToChatBot}>
        <Card.Body>
            <Card.Title>Your Chat Bot</Card.Title>
            <Card.Text>
                <FontAwesomeIcon icon={faRobot} size="lg" />
            </Card.Text>
        </Card.Body>
        </Card>
        <Card style={{ width: '18rem', cursor: 'pointer' }} onClick={navigateToArticles}>
        <Card.Body>
            <Card.Title>Health Articles</Card.Title>
            <Card.Text>
                <FontAwesomeIcon icon={faLightbulb} size="lg" />
            </Card.Text>
        </Card.Body>
        </Card>
    </div>
  );
};
