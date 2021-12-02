import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, message, Select, Space } from 'antd';
import { useState } from 'react';
import { createPatient, GENDER } from '../services/patient.service';

interface PatientFormField {
  name: string;
  gender: GENDER;
  age: string;
  occupation: string;
}

interface PatientFormProps {
  callback: () => {};
}

const PatientForm = ({ callback }: PatientFormProps) => {
  const { Option } = Select;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const [symbolsArr] = useState(['e', 'E', '+', '-', '.']);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    form.resetFields();
  };

  const onFinish = async (value: PatientFormField) => {
    try {
      const createPatientData = { ...value, age: +value.age };
      await createPatient(createPatientData);
      callback();
      message.success('completed');
      onClose();
    } catch (error: any) {
      const { response } = error;
      message.error(
        response.data.message || 'Something wrong please try again.',
      );
    }
  };

  return (
    <section>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        New Patient
      </Button>
      <Drawer
        title="Create a new Patient"
        width={720}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Please enter user name or alias' },
            ]}
          >
            <Input allowClear placeholder="Please enter user name or alias" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select a gender' }]}
          >
            <Select placeholder="Please select a gender">
              <Option value={GENDER.MALE}>Male</Option>
              <Option value={GENDER.FEMALE}>Female</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: 'Please enter user age' }]}
          >
            <Input
              type="number"
              onKeyDown={(e) =>
                symbolsArr.includes(e.key) && e.preventDefault()
              }
              placeholder="Please enter user age"
            />
          </Form.Item>
          <Form.Item
            label="Occupation"
            name="occupation"
            rules={[
              { required: true, message: 'Please choose user occupation' },
            ]}
          >
            <Input allowClear placeholder="Please enter user occupation" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </section>
  );
};

export default PatientForm;
