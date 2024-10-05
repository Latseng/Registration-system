import { useState } from "react";
import { Form, Select, Row, Col } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const DatePicker = ({form}) => {
  const [year, setYear] = useState(null); 
  const [month, setMonth] = useState(null); 
  const [day, setDay] = useState(null); 

  const getDaysInMonth = (year, month) => {
    if (!year || !month) return 0; // 如果沒有選擇年份或月份，回傳 0 天
    return dayjs(`${year}-${month}`).daysInMonth(); // 計算某年某月的天數
  };

  const years = Array.from({ length: 125 }, (_, i) => dayjs().year() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1 ~ 12 月
  const days = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, i) => i + 1
  ); // 動態生成日期數字

  // 當年份變化時
  const handleYearChange = (value) => {
    setYear(value);
    setMonth(null); // 清空月份
    setDay(null); // 清空日期
  };

  // 當月份變化時
  const handleMonthChange = (value) => {
    setMonth(value);
    setDay(null); // 清空日期
  };

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item
          name="year"
          rules={[{ required: true, message: "請選擇年份" }]}
        >
          <Select
            value={year} 
            onChange={handleYearChange}
            placeholder="西元年" 
            style={{ width: "100%" }}
          >
            {years.map((y) => (
              <Option key={y} value={y}>
                {y}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="month"
          rules={[{ required: true, message: "請選擇月份" }]}
        >
          <Select
            value={month} 
            onChange={handleMonthChange}
            placeholder="月" 
            style={{ width: "100%" }}
            disabled={!year} 
          >
            {months.map((m) => (
              <Option key={m} value={m}>
                {m}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="day"
          rules={[{ required: true, message: "請選擇日期" }]}
        >
          <Select
            value={day} 
            onChange={setDay}
            placeholder="日"
            style={{ width: "100%" }}
            disabled={!month} 
          >
            {days.map((d) => (
              <Option key={d} value={d}>
                {d}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default DatePicker;
