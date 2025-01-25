import dayjs from "dayjs";

export function formattedDate(date) {
  return (
    dayjs(date).format("M/D") +
    `(${"日一二三四五六".charAt(dayjs(date).day())})`
  );
}

//創建兩個禮拜的日期陣列
export const generateDates = () => {
  const dates = [];
  for (let i = 0; i < 14; i++) {
    //以當前日期，創建一個起始日期
    const date = dayjs().add(i, "day");
    //排除週末
    if (date.day() !== 0 && date.day() !== 6) {
      const formattedDate = `${date.format("M/D")}(${"日一二三四五六".charAt(
        date.day()
      )})`; //將日期格式化，像是 1/1(日)

      dates.push(formattedDate);
    }
  }
  return dates;
};

export const mapSchedulesToSlots = (schedules, time, dates) => {
  return dates.reduce((acc, date, index) => {
    const filteredSchedules = schedules.filter(
      (schedule) =>
        schedule.scheduleSlot.includes(time) &&
        dayjs(schedule.date).format("M/D") === date.split("(")[0]
    );
    acc[`date${index}`] = filteredSchedules;
    return acc;
  }, {});
};
