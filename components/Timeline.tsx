import { Col, Empty, Row, Timeline } from 'antd';
import { useEffect, useState } from 'react';
import { getTextGender } from '../services/patient.service';
import {
  deleteTimeline,
  getLocationTimelines,
} from '../services/timeline.service';
import {
  clearTime,
  getDateFormat,
  getTimeFormat,
  isDuplicatDate,
} from '../utils/utils';

interface TimelineComponentProps {
  patient: any;
  callback: () => {};
}

const TimelineComponent = ({ patient, callback }: TimelineComponentProps) => {
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    fetchLocations();
  }, [patient]);

  const fetchLocations = async () => {
    if (patient) {
      const response = await getLocationTimelines(patient.name);
      setLocations(response);
    }
  };

  const displayBetweenTime = (date1: any, date2: any): string => {
    date1 = getTimeFormat(date1);
    date2 = getTimeFormat(date2);
    return `${date1} - ${date2}`;
  };

  const onDelete = async (id: number) => {
    if (window.confirm('ยืนยันการลบข้อมูล ?')) {
      await deleteTimeline(id);
      callback();
    }
  };

  const displayTimelines = () => {
    let dateLabel;
    let inDayTimeline = [];
    const timelineItems = [];

    if (patient) {
      const { timelines } = patient;
      if (timelines.length === 1) {
        return (
          <Timeline.Item label={getDateFormat(dateLabel)}>
            <div className="timeline">
              <Row gutter={16}>
                <Col className="text-yellow">
                  {displayBetweenTime(
                    timelines[0].startDate,
                    timelines[0].endDate,
                  )}
                </Col>
                <Col>
                  <div>{timelines[0].detail}</div>
                  <div className="text-light-blue2">
                    {timelines[0].locationName}
                  </div>
                </Col>
                <Col>
                  <div
                    className="remove-btn"
                    onClick={() => onDelete(timelines[0].id)}
                  >
                    x
                  </div>
                </Col>
              </Row>
            </div>
          </Timeline.Item>
        );
      }

      for (let i = 0; i < timelines.length - 1; i++) {
        const date2 = clearTime(timelines[i].startDate);
        const date1 = clearTime(timelines[i + 1].startDate);

        const element = (
          <Row gutter={16}>
            <Col span={8} className="text-yellow">
              {displayBetweenTime(timelines[i].startDate, timelines[i].endDate)}
            </Col>
            <Col span={8}>
              <div>{timelines[i].detail}</div>
              <div className="text-light-blue2">
                {timelines[i].locationName}
              </div>
            </Col>
            <Col span={8}>
              <div
                className="remove-btn"
                onClick={() => onDelete(timelines[i].id)}
              >
                x
              </div>
            </Col>
          </Row>
        );

        inDayTimeline.push(element);
        if (!isDuplicatDate(date1, date2) || i === timelines.length - 1) {
          dateLabel = timelines[i].startDate;
          const item = (
            <Timeline.Item label={getDateFormat(dateLabel)}>
              <div className="timeline">{inDayTimeline}</div>
            </Timeline.Item>
          );
          timelineItems.push(item);
          inDayTimeline = [];
        }

        if (i === timelines.length - 2) {
          let timeline = timelines[i + 1];
          const item = (
            <Timeline.Item label={getDateFormat(timeline.startDate)}>
              <div className="timeline">
                <Row gutter={16}>
                  <Col span={8} className="text-yellow">
                    {displayBetweenTime(timeline.startDate, timeline.endDate)}
                  </Col>
                  <Col span={8}>
                    <div>{timeline.detail}</div>
                    <div className="text-light-blue2">
                      {timeline.locationName}
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      className="remove-btn"
                      onClick={() => onDelete(timeline.id)}
                    >
                      x
                    </div>
                  </Col>
                </Row>
              </div>
            </Timeline.Item>
          );
          timelineItems.push(item);
        }
      }
    }
    return timelineItems;
  };

  if (!patient || patient.timelines.length === 0) {
    return <Empty />;
  }

  return (
    <section className="timeline-container">
      <div className="text-center">
        <div className="profile-card">
          <div className="small">{getTextGender(patient.gender)}</div>
          <div className="large">{`${patient.age} yaers old`}</div>
          <div className="small">{patient.occupation}</div>
        </div>
      </div>
      <br />
      <br />
      <Timeline mode={'left'}>{displayTimelines()}</Timeline>
      <div>
        <div className="large text-yellow">Visited Places</div>

        {locations.length !== 0 ? (
          locations.map((value: any) => {
            return (
              <span className="small">
                {value.locationName}&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            );
          })
        ) : (
          <Empty />
        )}
      </div>
    </section>
  );
};

export default TimelineComponent;
