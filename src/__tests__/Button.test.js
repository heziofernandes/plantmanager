import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Button} from '../components/Button';

test('Button should render OK', async () => {
    const {getByText, getByTestId, getAllByTestId, queryByText} = render(
        <Button
        title="hezio"
        />,
      );

    const item1 = getByText('hezio');
    expect(item1).toBeDefined();
});