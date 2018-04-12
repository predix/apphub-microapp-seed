import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs/react';
import App from './';

storiesOf('apphub-microapp-seed / Containers / App', module)
	.add('default', () => (
		<App/>
	))
	;
