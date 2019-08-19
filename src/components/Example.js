import React from 'react';
import Loadable from 'react-loadable';
import Card from 'predix-ui/dist/es/components/px/Card';
import Loading from './Loading';

const LoadableNested = Loadable({
  loader: () => import('./ExampleNested'),
  loading: Loading
});

export default function Example() {
  return (
    <Card headerText="Example Code Splitting">
      <h1>Hello from a loadable component</h1>
      <LoadableNested />
    </Card>
  );
}
