import React from 'react';
import SimpleParameterTable from 'components/table/simpleparametertable';

const l = { title: 'SimpleParameterTable', component: SimpleParameterTable };
export default l;

const Story = (args) => <SimpleParameterTable {...args} />;

export const MySimpleParameterTable = Story.bind({});
MySimpleParameterTable.args = {
  parameters: [1, 2, 3, 4, 5, 6].map((i) => {
    return { key: `key-${i}`, value: `value-${i}` };
  }),
};
