import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Card from './';

describe('Ajax Card', () => {
  test('should render', () => {
    const wrapper = shallow(<Card headerText="My Header" />);
    expect(wrapper.find('.ajax-card')).toHaveLength(1);
  });
  test('should match snapshot', () => {
    const tree = renderer.create(<Card headerText="My Header">Content</Card>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
