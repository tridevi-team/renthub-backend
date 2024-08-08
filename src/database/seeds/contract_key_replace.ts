import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("contract_key_replace").del();

    // Inserts seed entries
    await knex("contract_key_replace").insert([
        { id: 1, key: "{{CONTRACT_START_DATE}}", label: "Thời gian bắt đầu hợp đồng" },
        { id: 2, key: "{{CONTRACT_END_DATE}}", label: "Thời gian kết thúc hợp đồng" },
        { id: 3, key: "{{CONTRACT_MONTHS}}", label: "Số tháng hợp đồng" },
        { id: 4, key: "{{RENT_COST}}", label: "Tiền thuê" },
        { id: 5, key: "{{DEPOSIT_AMOUNT}}", label: "Tiền cọc" },
        { id: 6, key: "{{RENTAL_AMOUNT_IN_WORDS}}", label: "Số tiền thuê ghi bằng chữ" },
        { id: 7, key: "{{DEPOSIT_AMOUNT_IN_WORDS}}", label: "Số tiền cọc ghi bằng chữ" },
        { id: 8, key: "{{FEE_COLLECTION_DAY}}", label: "Ngày thu tiền" },
        { id: 9, key: "{{COLLECTION_CYCLE}}", label: "Chu kỳ thu tiền" },
        { id: 10, key: "{{USE_SERVICES}}", label: "Dịch vụ sử dụng" },
        { id: 11, key: "{{HOUSE_NAME}}", label: "Tên nhà" },
        { id: 12, key: "{{ROOM_NAME}}", label: "Tên phòng" },
        { id: 13, key: "{{SQUARE_METER}}", label: "Diện tích cho thuê" },
        { id: 14, key: "{{RENTER_NAME}}", label: "Tên khách thuê" },
        { id: 15, key: "{{RENTER_ADDRESS}}", label: "Địa chỉ khách thuê" },
        { id: 16, key: "{{RENTER_BIRTHDAY}}", label: "Ngày sinh khách thuê" },
        { id: 17, key: "{{RENTER_IDENTITY_NUMBER}}", label: "Số CCCD/CMND khách thuê" },
        { id: 18, key: "{{RENTER_DATE_OF_ISSUANCE}}", label: "Ngày cấp CCCD khách thuê" },
        { id: 19, key: "{{RENTER_PLACE_OF_ISSUE}}", label: "Nơi cấp CCCD khách thuê" },
        { id: 20, key: "{{RENTER_ADDRESS}}", label: "Địa chỉ khách thuê" },
        { id: 21, key: "{{RENTER_PHONE_NUMBER}}", label: "SĐT khách thuê" },
        { id: 22, key: "{{ROOM_VEHICLE_LIST}}", label: "Danh sách phương tiện" },
        { id: 23, key: "{{CURRENT_DATE}}", label: "Ngày hiện tại" },
        { id: 24, key: "{{RENTAL_HOUSE_ADDRESS}}", label: "Địa chỉ nhà cho thuê" },
        { id: 25, key: "{{HOST_NAME}}", label: "Tên chủ nhà" },
        { id: 26, key: "{{OWNER_BIRTHDAY}}", label: "Ngày sinh khách thuê" },
        { id: 27, key: "{{OWNER_IDENTITY_NUMBER}}", label: "Số CCCD/CMND chủ nhà" },
        { id: 28, key: "{{OWNER_DATE_OF_ISSUANCE}}", label: "Ngày cấp CCCD chủ nhà" },
        { id: 29, key: "{{OWNER_PLACE_OF_ISSUE}}", label: "Nơi cấp CCCD chủ nhà" },
        { id: 30, key: "{{OWNER_ADDRESS}}", label: "Địa chỉ chủ nhà" },
        { id: 31, key: "{{OWNER_PHONE}}", label: "SĐT chủ nhà" },
        { id: 32, key: "{{BANK_NAME}}", label: "Tên ngân hàng đầy đủ" },
        { id: 33, key: "{{ABBREVIATED_BANK_NAME}}", label: "Tên ngân hàng viết tắt" },
        { id: 34, key: "{{OWNER_BANK_FULL_NAME}}", label: "Tên chủ tài khoản" },
        { id: 35, key: "{{OWNER_BANK_ACCOUNT_NUMBER}}", label: "Số tài khoản" },
    ]);
};
