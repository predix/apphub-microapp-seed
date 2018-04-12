import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs/react';

import ErrorPage from './404';
import HomePage from './home';

storiesOf('apphub-microapp-seed / Pages', module)
	.add('Home page', () => (
		<HomePage/>
	))
	.add('404 page', () => (
		<ErrorPage/>
	))
	;
