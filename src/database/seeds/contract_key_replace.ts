import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("contract_key_replace").del();

    // Inserts seed entries
    await knex("contract_key_replace").insert([
        { key: "{{CONTRACT_START_DATE}}", label: "Thời gian bắt đầu hợp đồng" },
        { key: "{{CONTRACT_END_DATE}}", label: "Thời gian kết thúc hợp đồng" },
        { key: "{{CONTRACT_MONTHS}}", label: "Số tháng hợp đồng" },
        { key: "{{RENT_COST}}", label: "Tiền thuê" },
        { key: "{{DEPOSIT_AMOUNT}}", label: "Tiền cọc" },
        {
            key: "{{RENTAL_AMOUNT_IN_WORDS}}",
            label: "Số tiền thuê ghi bằng chữ",
        },
        {
            key: "{{DEPOSIT_AMOUNT_IN_WORDS}}",
            label: "Số tiền cọc ghi bằng chữ",
        },
        { key: "{{FEE_COLLECTION_DAY}}", label: "Ngày thu tiền" },
        { key: "{{COLLECTION_CYCLE}}", label: "Chu kỳ thu tiền" },
        { key: "{{EQUIPMENT_LIST}}", label: "Danh sách thiết bị" },
        { key: "{{USE_SERVICES}}", label: "Dịch vụ sử dụng" },
        { key: "{{HOUSE_NAME}}", label: "Tên nhà" },
        { key: "{{ROOM_NAME}}", label: "Tên phòng" },
        { key: "{{SQUARE_METER}}", label: "Diện tích cho thuê" },
        { key: "{{RENTER_NAME}}", label: "Tên khách thuê" },
        { key: "{{RENTER_ADDRESS}}", label: "Địa chỉ khách thuê" },
        { key: "{{RENTER_BIRTHDAY}}", label: "Ngày sinh khách thuê" },
        { key: "{{RENTER_IDENTITY_NUMBER}}", label: "Số CCCD/CMND khách thuê" },
        {
            key: "{{RENTER_DATE_OF_ISSUANCE}}",
            label: "Ngày cấp CCCD khách thuê",
        },
        { key: "{{RENTER_PLACE_OF_ISSUE}}", label: "Nơi cấp CCCD khách thuê" },
        { key: "{{RENTER_PHONE_NUMBER}}", label: "SĐT khách thuê" },
        // { key: "{{ROOM_VEHICLE_LIST}}", label: "Danh sách phương tiện" },
        { key: "{{CURRENT_DATE}}", label: "Ngày hiện tại" },
        { key: "{{RENTAL_HOUSE_ADDRESS}}", label: "Địa chỉ nhà cho thuê" },
        { key: "{{HOST_NAME}}", label: "Tên chủ nhà" },
        { key: "{{OWNER_BIRTHDAY}}", label: "Ngày sinh chủ nhà" },
        { key: "{{OWNER_IDENTITY_NUMBER}}", label: "Số CCCD/CMND chủ nhà" },
        { key: "{{OWNER_DATE_OF_ISSUANCE}}", label: "Ngày cấp CCCD chủ nhà" },
        { key: "{{OWNER_PLACE_OF_ISSUE}}", label: "Nơi cấp CCCD chủ nhà" },
        { key: "{{OWNER_ADDRESS}}", label: "Địa chỉ chủ nhà" },
        { key: "{{OWNER_PHONE}}", label: "SĐT chủ nhà" },
        // { key: "{{BANK_NAME}}", label: "Tên ngân hàng đầy đủ" },
        // { key: "{{ABBREVIATED_BANK_NAME}}", label: "Tên ngân hàng viết tắt" },
        // { key: "{{OWNER_BANK_FULL_NAME}}", label: "Tên chủ tài khoản" },
        // { key: "{{OWNER_BANK_ACCOUNT_NUMBER}}", label: "Số tài khoản" },
    ]);
}
