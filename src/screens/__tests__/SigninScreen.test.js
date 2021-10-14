import React from 'react';
import { render } from '@testing-library/react-native';
import { renderer } from 'react-test-renderer';
import App from '../../../App'
import SigninScreen from '../SigninScreen';
import { Context as AuthContext } from '../../context/AuthContext';

it('render default screen signin', () => {
    const screen = render(<SigninScreen />, {wrapper: AuthContext});
    screen.getByText('Login');
})

it('renders default elements', () => {
    const { getAllByText  } = render(<App />);
    // getAllByText('Cestas');
});

// describe('<App />', () => {
//     it('has 1 child', () => {
//         const tree = renderer.create(<App />).toJSON();
        
//         expect(tree.children.length).toBe(7);
//     });
// });