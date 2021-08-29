import {
  Button,
  Container,
  Nav,
  Navbar,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks';

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>{t('logout')}</Button>
      : null
  );
};

const Navigation = () => {
  const { t } = useTranslation();
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">{t('brand')}</Navbar.Brand>
        <Nav className="mr-auto" />
        <AuthButton />
      </Container>
    </Navbar>
  );
};
export default Navigation;
