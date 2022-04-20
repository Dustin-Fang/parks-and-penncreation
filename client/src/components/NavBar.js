import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from "shards-react";

class NavBar extends React.Component {
    render() {
        return(
        <Navbar type="dark" theme="primary" expand="md">
        <NavbarBrand href="/"> ParksnRec </NavbarBrand>
          <Nav navbar>
            <NavItem>
              <NavLink active href="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active href="/parks">
                Parks
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/species" >
                Species
              </NavLink>
            </NavItem>
          </Nav>
      </Navbar>
        )
    }
}

export default NavBar