import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  TimePicker,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import React, { useState } from 'react';
import { LOCATION_TYPE, messageResponse } from '../interfaces/common.interface';
import { createTimeline } from '../services/timeline.service';

interface TimelineFormField {
  startDate: Date;
  endDate: Date;
  detail: string;
  locationType: LOCATION_TYPE;
  locationName: string;
}

interface TimelineFormProps {
  name: string;
  callback: () => {};
}

const TimelineForm = ({ name, callback }: TimelineFormProps) => {
  const [form] = useForm();
  const { TextArea } = Input;
  const [isRequire, setIsRequire] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [disableHours, setDisableHours] = useState<number[]>([]);
  const [disableMinutes, setDisableMinutes] = useState<number[]>([]);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    form.resetFields();
  };

  const onLocationTypeChange = (type: LOCATION_TYPE) => {
    const isRequire = isRequireLocation(type);
    setIsRequire(isRequire);
  };

  const isRequireLocation = (type: LOCATION_TYPE): boolean => {
    return type === LOCATION_TYPE.INDOOR || type === LOCATION_TYPE.OUTDOOR;
  };

  const onChange = (v: any) => {
    const startDate = form.getFieldValue('startDate');
    const endDate = moment(startDate)
      .hours(moment(v).hour())
      .minutes(moment(v).minute());
    form.setFieldsValue({ endDate });
  };

  const onFinish = async (value: TimelineFormField) => {
    try {
      await createTimeline({ name, ...value });
      callback();
      onClose();
      message.success(messageResponse.SUCCESS);
    } catch (error: any) {
      const { response } = error;
      message.error(response.data.message || messageResponse.SOMETHING_WRONG);
    }
  };

  function range(start: number, end: number) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  function onDateChange(date: any) {
    console.log(moment(date).hour());
    let hours = moment(date).hour() - 1;
    let minutes = moment(date).minute();
    const disableHours = [];
    const disableMinutes = [];
    while (hours >= 0) {
      disableHours.push(hours);
      hours -= 1;
    }

    while (minutes >= 0) {
      disableMinutes.push(minutes);
      minutes -= 1;
    }
    setDisableHours(disableHours);
    setDisableMinutes(disableMinutes);
  }

  return (
    <section>
      <Button
        type="primary"
        onClick={showDrawer}
        icon={<PlusOutlined />}
        style={{ background: '#ffc107', borderColor: '#ffc107' }}
      >
        New Timeline
      </Button>
      <Drawer
        title={`Create a new  ${name}'s Timeline`}
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
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row justify="start" gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Form"
                name="startDate"
                rules={[
                  { required: true, message: 'Please choose date and time' },
                ]}
              >
                <DatePicker
                  onChange={(e) => onDateChange(e)}
                  style={{ width: '100%' }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="To"
                name="endDate"
                rules={[{ required: true, message: 'Please choose time' }]}
              >
                <TimePicker
                  disabledHours={() => disableHours}
                  disabledMinutes={() => disableMinutes}
                  showNow={false}
                  onChange={onChange}
                  format="HH:mm"
                />
                ;
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                label="Detail"
                name="detail"
                rules={[{ required: true, message: 'Please enter  detail' }]}
              >
                <TextArea rows={10} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="start" gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Location Type"
                name="locationType"
                rules={[
                  { required: true, message: 'Please choose location type' },
                ]}
              >
                <Select onChange={onLocationTypeChange}>
                  <Select.Option value={LOCATION_TYPE.HOME}>
                    {LOCATION_TYPE.HOME}
                  </Select.Option>
                  <Select.Option value={LOCATION_TYPE.INDOOR}>
                    {LOCATION_TYPE.INDOOR}
                  </Select.Option>
                  <Select.Option value={LOCATION_TYPE.OUTDOOR}>
                    {LOCATION_TYPE.OUTDOOR}
                  </Select.Option>
                  <Select.Option value={LOCATION_TYPE.TRAVELLING}>
                    {LOCATION_TYPE.TRAVELLING}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Location Name"
                name="locationName"
                rules={[
                  {
                    required: isRequire,
                    message: 'Please choose enter location name',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button style={{ width: '100%' }} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </section>
  );
};

export default TimelineForm;
