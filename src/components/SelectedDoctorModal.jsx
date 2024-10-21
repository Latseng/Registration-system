import {Modal, Avatar, Card} from "antd"

const gridStyle = {
  width: "25%",
  textAlign: "center",
};

const SelectedDoctorModal = ({selectedDoctor, isDoctorModalOpen, handleCancel, handleAppointment}) => {
  return (
    <Modal
      open={isDoctorModalOpen}
      onCancel={() => handleCancel("doctor")}
      footer={null}
    >
      <div className="p-4">
        <h3 className="text-2xl">{selectedDoctor.name} 醫師</h3>
        <Avatar
          shape="square"
          size={100}
          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${selectedDoctor.id}`}
          alt={`${selectedDoctor.name}照片`}
          style={{ width: "100px", marginBottom: "10px" }}
        />
        <div className="my-4 text-base">
          <p>科別： {selectedDoctor.specialty}</p>
          <p>專長：{JSON.parse(selectedDoctor.description).join("、")}</p>
        </div>
        <Card className="my-4" title="可掛號時段">
          {selectedDoctor.schedules.map((schedule) => (
            <Card.Grid
              className="cursor-pointer hover:text-blue-500"
              onClick={() =>
                handleAppointment({
                  date: schedule.date,
                  doctor: selectedDoctor.name,
                  time: schedule.scheduleSlot,
                })
              }
              key={schedule.id}
              style={gridStyle}
            >
              <p>{schedule.date}</p>
              <p>{schedule.scheduleSlot}</p>
              <p>已掛號{schedule.bookedAppointments}人</p>
            </Card.Grid>
          ))}
        </Card>
      </div>
    </Modal>
  );
}

export default SelectedDoctorModal