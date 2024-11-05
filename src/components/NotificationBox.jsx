import React from 'react';
import { Card, Badge } from 'antd';
import { formatDistance } from 'date-fns';

const NotificationBox = ({ notification }) => {
	const { createdAt, message, read, type } = notification;

	return (
		<Card
			hoverable
			style={{ marginBottom: '10px', width: '100%' }}
			bodyStyle={{ padding: '10px' }}
			onClick={type === 'news' ? () => { window.location.href = '/news' } : undefined}
		>
			<Badge
				color={read ? 'grey' : 'blue'}
				text={type.charAt(0).toUpperCase() + type.slice(1)}
				style={{ marginBottom: '5px' }}
			/>
			<p style={{ fontWeight: read ? 'normal' : 'bold', marginBottom: '5px' }}>
				{message}
			</p>
			<span style={{ fontSize: '12px', color: '#888' }}>
				{formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}
			</span>
		</Card>
	);
};

export default NotificationBox;
