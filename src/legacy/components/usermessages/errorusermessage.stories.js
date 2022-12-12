import React from 'react';
import ErrorUserMessage from 'legacy/components/usermessages/errorusermessage';

const l = { title: 'ErrorUserMessage', component: ErrorUserMessage };
export default l;

const Story = (args) => <ErrorUserMessage {...args} />;

export const ErrorMessage = Story.bind({});
ErrorMessage.args = {
  title: 'This is the error title',
};

export const Title = Story.bind({});
Title.args = {
  ...ErrorMessage.args,
  message: 'This is the message',
};

export const StackErrorMessage = Story.bind({});
StackErrorMessage.args = {
  ...Title.args,
  stack: 'This is the stack',
};
