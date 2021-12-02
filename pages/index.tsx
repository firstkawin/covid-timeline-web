import { Button, Col, Form, message, Row, Select, Typography } from 'antd';
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import PatientForm from '../components/PatientForm';
import TimelineComponent from '../components/Timeline';
import TimelineForm from '../components/TimelineForm';
import { messageResponse, Patient } from '../interfaces/common.interface';
import {
  getNamePatients,
  getPatientTimeline,
} from '../services/patient.service';

const { Title } = Typography;

const Home: NextPage = () => {
  const [name, setName] = useState<string>('');

  const [patient, setPatient] = useState<Patient>();

  const [patientNames, setPatientNames] = useState([{} as { name: string }]);

  useEffect(() => {
    fetchPatient();
  }, []);

  const fetchPatient = async () => {
    const response = await getNamePatients();
    setPatientNames(response);
  };

  const fetchPatientTimeline = async (name: string) => {
    const response = await getPatientTimeline(name);
    setPatient(response);
  };

  const onFinish = async (values: { name: string }) => {
    try {
      fetchPatientTimeline(values.name);
      setName(values.name);
      message.success(messageResponse.SUCCESS);
    } catch (error: any) {
      const { response } = error;
      message.error(response.data.message || messageResponse.SOMETHING_WRONG);
    }
  };
  return (
    <section className="container">
      <Title className="text-center text-yellow">
        COVID Timeline Generator
      </Title>
      <Form onFinish={onFinish}>
        <Row justify="center" gutter={16}>
          <Col span={12}>
            <Form.Item
              label="name or alias"
              name="name"
              rules={[
                { required: true, message: 'Please choose name or alias' },
              ]}
            >
              <Select>
                {patientNames &&
                  patientNames.map((patientName) => (
                    <Select.Option value={patientName.name}>
                      {patientName.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Button
                style={{ width: '-webkit-fill-available' }}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <PatientForm callback={fetchPatient} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {name && (
        <div className="text-end">
          <TimelineForm
            name={name}
            callback={() => fetchPatientTimeline(name)}
          />
        </div>
      )}
      <TimelineComponent
        patient={patient}
        callback={() => fetchPatientTimeline(name)}
      />
    </section>
  );
};

export default Home;
