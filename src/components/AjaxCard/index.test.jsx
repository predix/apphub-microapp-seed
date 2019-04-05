import React from 'react';
import renderer from 'react-test-renderer';
// import nock from 'nock';
import axios from 'axios';
import { shallow } from 'enzyme';

import Card from '.';

jest.mock('axios');

describe('Ajax Card', () => {
  test('should render', () => {
    const wrapper = shallow(<Card headerText="My Header" />);
    expect(wrapper.find('.ajax-card')).toHaveLength(1);
  });
  test('should match snapshot', () => {
    const tree = renderer.create(<Card headerText="My Header">Content</Card>).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('should update state on URL change', () => {
    const testUrl = 'http://localhost:80/api/test';
    // const baseUrl = 'http://localhost:80';
    const resp = { data: ['one', 'two', 'three'] };
    // const scope = nock(baseUrl).get('/api/test').reply(200, resp);
    // console.log(scope.pendingMocks());

    // Mock axios get
    axios.get.mockResolvedValue({ data: resp });

    const wrapper = shallow(<Card headerText="My Header" />);
    expect(wrapper.find('.ajax-card')).toHaveLength(1);

    // Input
    const inputElement = wrapper.find('#urlInput');
    expect(inputElement).toHaveLength(1);

    // Input Change
    inputElement.simulate('change', { target: { value: testUrl } });
    expect(wrapper.state('ajaxEndpoint')).toBe(testUrl);

    // Form submit
    wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });
    expect(wrapper.state('pendingRequest')).toBe(true);

    // Form response
    console.log(wrapper.state());
    // expect(wrapper.state('ajaxData').data).toHaveLength(3);
  });
});
