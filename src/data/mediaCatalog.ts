import { MediaMaterial, SubmittedRequest } from '../types';

/* คลังสื่อประชาสัมพันธ์เริ่มต้น (INITIAL_MEDIA_MATERIALS) */
export const INITIAL_MEDIA_MATERIALS: MediaMaterial[] = [
  {
    "id": "mat-001",
    "title": "สติ๊กเกอร์ มาตรา 28 วันห้ามขาย",
    "category": "สติ๊กเกอร์ (Sticker)",
    "description": "สติ๊กเกอร์แจ้งวันห้ามขายเครื่องดื่มแอลกอฮอล์ตามมาตรา 28 สำหรับติดหน้าร้านค้า/สถานที่จำหน่าย",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1QifjozdhP-_nAHvCjqaicSobYQO3NJMjfdqHQutGkMzfdIAyiwU8OQFpgV-DfSBnfZ38p8urc1nTeEMKugGelue2-43VFR9AKnZDhQhWql-HaXoLUzj9irD75E0AXCcVoUnadSwQJovxoZAlguyyQDoPtHh95Xpj8HRRqkx97Jfbb6zdngg9mIzu5uWQhHaC2wWGAFxKkJLhrh3teTc1QZ8l3Dd75-Vjq8eNWaZG4sA=w260",
    "availableStock": 8000,
  },
  {
    "id": "mat-002",
    "title": "สติ๊กเกอร์ เขตปลอดเครื่องดื่มแอลกอฮอล์",
    "category": "สติ๊กเกอร์ (Sticker)",
    "description": "สติ๊กเกอร์แสดงเขตปลอดเครื่องดื่มแอลกอฮอล์ สำหรับติดในพื้นที่ควบคุม",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1Qifg9hA0H-xLchIJfSPmN0oboeRcKAGuK8ZY1jGxpNwEhaJi4SPhgysbVMB0PSA0WG_dTFbYNrQSpf6QFSKWVcofx3BvDPwYwhB2tVcfZVtuFx3EIchAS0JbjTdHvBcrO64df1mO2jq68MPKmlR5a4wo0tqqAYjnlAfgEqUTVTOnW0RfBAfmsXfeb3-v1IpXYRWmlZUHbX86-vA5LET3i6i2aznYvF-wR7yPlT0Wk-A=w260",
    "availableStock": 7200,
  },
  {
    "id": "mat-003",
    "title": "สติ๊กเกอร์ ห้ามขายฯ แก่บุคคลอายุต่ำกว่า 20 ปีและคนมึนเมา",
    "category": "สติ๊กเกอร์ (Sticker)",
    "description": "สติ๊กเกอร์ห้ามขายเครื่องดื่มแอลกอฮอล์ให้บุคคลอายุต่ำกว่า 20 ปี และคนมึนเมา",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1Qifhi9wh4418fQ7W7-gCfrpW4NPdMNf4yBSpT5s9Uildo_gELPzTsHr2Ci5AVH4laqcQ1neO_J42544CPNMWdh4y0C3LbqwJWN24iJwtnjHOtVfey87T30xK9AY5XSc7Ozcg7MuPLb04ZYISuQb7eQ_OBAy6UGVbQTIdbbquyXeblBZ-J8fdK1cqIXZXtALn5Bo9K_HRvWag7y9SHwmGQKDyqbHBVzOzg3wAoE2c=w260",
    "availableStock": 9000,
  },
  {
    "id": "mat-004",
    "title": "สติ๊กเกอร์ สถานศึกษาปลอดเครื่องดื่มแอลกอฮอล์",
    "category": "สติ๊กเกอร์ (Sticker)",
    "description": "สติ๊กเกอร์สำหรับติดในสถานศึกษา แสดงเขตปลอดเครื่องดื่มแอลกอฮอล์",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1Qifhu6gVCqfVu2PDms13gfub89s-ARLO48bb-vv1ZVUPL4pcTwVjeyQzXa3cn_w4WLQQ1qHZQjwvgkzHDypkSE6iXYWwCV-Ii99BIloUWktPkmSqzUVfO4VqKZcKjx_nNcNYbsMmluEEYpdVTRf3JaHqmrG4fFS09jiBPsZxQ37EHCIys6q5HZmv7OxNgOLF9xEe0dg3HaupmbGUweL0QIJocPpjFMjXjSXN6iJ9Ygg=w260",
    "availableStock": 5500,
  },
  {
    "id": "mat-005",
    "title": "สติ๊กเกอร์ วันห้ามขายฯ ไทย/อังกฤษ/รัสเซีย/จีน",
    "category": "สติ๊กเกอร์ (Sticker)",
    "description": "สติ๊กเกอร์แจ้งวันห้ามขายเครื่องดื่มแอลกอฮอล์ 4 ภาษา (ไทย/อังกฤษ/รัสเซีย/จีน) สำหรับพื้นที่ท่องเที่ยว",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1QifgOYwgZ_iknfkg1-MWnL3Zz9rB8K_g0HKxEBIjmFov8cZuPqaWNjrxhcRcqCXcC3QzWcLRyfRM8AzQpZxCPEWESlOTI0e_J0GBmy6k-cA7BPBWLg7Ofkc1JoC3dSzwKI9I8QcmS__blpotnWAtFXUzSSonBlnvf3j-sFZhD85bNZM5Iw2kX-Vh1Pm3CjcThpN9lDw829GwFvHFCiw2olpWfyt_adb9EzIW9EZbMjw=w260",
    "availableStock": 3000,
  },
  {
    "id": "mat-006",
    "title": "สติ๊กเกอร์ วันห้ามขายฯ ไทย/อังกฤษ/เกาหลี/ญี่ปุ่น",
    "category": "สติ๊กเกอร์ (Sticker)",
    "description": "สติ๊กเกอร์แจ้งวันห้ามขายเครื่องดื่มแอลกอฮอล์ 4 ภาษา (ไทย/อังกฤษ/เกาหลี/ญี่ปุ่น) สำหรับพื้นที่ท่องเที่ยว",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1Qifh3aGbRpUuEmQYYlEMR2WeeoiBSS4obB3CR7z4_8zmjuNbi3Xwz8TW8opqZyI7Yaux1HiQYs3wVFsaVIS6-nCr6q9DI__iurnoMZ_lKvL0a2SvNTULzPg44cMcIu3p4_gPeo_rGNB4CXSshswHRvBfhUBLINYMvFsJ68DkB3ke99K60heuSw1VRLQljTFN3wFPCaqC5bknCHkEKOjL0kIUOIbXODcoiqi78tF0=w260",
    "availableStock": 3000,
  },
  {
    "id": "mat-007",
    "title": "สติ๊กเกอร์ วันห้ามขายฯ ไทย/อังกฤษ/ลาว/พม่า",
    "category": "สติ๊กเกอร์ (Sticker)",
    "description": "สติ๊กเกอร์แจ้งวันห้ามขายเครื่องดื่มแอลกอฮอล์ 4 ภาษา (ไทย/อังกฤษ/ลาว/พม่า) สำหรับพื้นที่ชายแดน",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1QifjDIh7PU8lKvMz8blZQ81gTPYTtzbQBFDpPpkb6Kr4GEosipPo9mg6D3kGISFchf_Wgy2yhtngje9owcV2sJMW2Rx34U-9BMpd2Ry_cNH5_8HWmq9M3F5FedClpcJ7gPm5ItEgiClj9J2g2PlI2vLe5MgDO4cH-9LuS22yRvRSzvWnaKppXowjxTKjag2r5PRLT7VyvvKnCox39WjqPCovRHJeF-unnvYZ5Syo=w260",
    "availableStock": 3000,
  },
  {
    "id": "mat-008",
    "title": "สติ๊กเกอร์ บุคคลที่ห้ามขายฯ ไทย/อังกฤษ/รัสเซีย/จีน",
    "category": "สติ๊กเกอร์ (Sticker)",
    "description": "สติ๊กเกอร์แจ้งบุคคลที่ห้ามขายเครื่องดื่มแอลกอฮอล์ 4 ภาษา (ไทย/อังกฤษ/รัสเซีย/จีน)",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1Qifj7nFW5esll2lc_0Mb0rm1pf8K9s6816mYJJCjAD7dnnV9iCauJ0elB0Mbas4Nvyo0D-BqizbCk7to_h4sMXDaqI6JcPIrOoPFxczpbCyokLDAhSmtsKSSgOm5jqAaP3D342UPWXsYSZw_S5zJuonezAfq6OTIJ3VbmATfm_GfeQCv3cE1CGlVM8JjWrTGJxWrmJIziqtn_Ec5sdgnSCWL6shqlXnDfWmEbto-r-w=w260",
    "availableStock": 3000,
  },
  {
    "id": "mat-009",
    "title": "สติ๊กเกอร์ บุคคลที่ห้ามขายฯ ไทย/อังกฤษ/เกาหลี/ญี่ปุ่น",
    "category": "สติ๊กเกอร์ (Sticker)",
    "description": "สติ๊กเกอร์แจ้งบุคคลที่ห้ามขายเครื่องดื่มแอลกอฮอล์ 4 ภาษา (ไทย/อังกฤษ/เกาหลี/ญี่ปุ่น)",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1QifgxW-GcToTpMneJJ54QlP5pizF7pbnyyUcJwisEh20IYLaU2dJReKVBFNADIiqnUrWU9PNECxXNExu3uJ0x8iIhKvEDW9g6kQd8Inw0ef8iRSoYjFjMrnkPXbnR4v4m851RM9gR_V7pCktXNS6r-aJvpYcOutMTjgLd9G5XeGBDjKOkjvQmij5rJ1IGtNpj0SDXU9XaL9i5czaDOPhEkGejiW8ghXHzvNuGL4Elfg=w260",
    "availableStock": 3000,
  },
  {
    "id": "mat-010",
    "title": "สติ๊กเกอร์ บุคคลที่ห้ามขายฯ ไทย/อังกฤษ/ลาว/พม่า",
    "category": "สติ๊กเกอร์ (Sticker)",
    "description": "สติ๊กเกอร์แจ้งบุคคลที่ห้ามขายเครื่องดื่มแอลกอฮอล์ 4 ภาษา (ไทย/อังกฤษ/ลาว/พม่า)",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1QifjRWTgGawk3QvW3cMHFTWRzzuOJFDleHAvGV6uij9EhmJ52xp59ycDp9AnTKWitbWwx-cAIlcyU0thb02SRFfCZYPB9c6DyXg2edyVOCWDemjQ-ZMrqLE7EWkCp2cXawo2r-VDVMAobqj3mS8_3Df0aZbPJZxmz3F_aXTI7E-g_P2LOuvp2sNHvT0T-9WMG6lQ9QMbWcS2-N1rmodx1SQTrDri18uULWedSwI2TgQ=w260",
    "availableStock": 3000,
  },
  {
    "id": "mat-011",
    "title": "สติ๊กเกอร์ เวลาขายฯ ไทย/อังกฤษ/รัสเซีย/จีน",
    "category": "สติ๊กเกอร์ (Sticker)",
    "description": "สติ๊กเกอร์แจ้งเวลาขายเครื่องดื่มแอลกอฮอล์ที่กฎหมายกำหนด 4 ภาษา (ไทย/อังกฤษ/รัสเซีย/จีน)",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1Qifjuuzt9Amg-uywSVLPSGE4CrL5hZ6tIv7ESviYPTWKY4ujexZmDqM2U9t_cXPYqHzWcAm7qkIdhYM8YEG1Ood62fVjJ7RyxN4RfP127VamYwkHhgaQlcICa-T_EeBbpGMK66dFuoDFuCDHhEA2Bp2CUgKC0f3S_FxftUanD2S2Vdky078argfyQCIvJkF8zCpNuN24Mpa-hcoJT05Dzh2YmZrwYF_iAHOo1rwLo_w=w260",
    "availableStock": 3000,
  },
  {
    "id": "mat-012",
    "title": "สติ๊กเกอร์ เวลาขายฯ ไทย/อังกฤษ/เกาหลี/ญี่ปุ่น",
    "category": "สติ๊กเกอร์ (Sticker)",
    "description": "สติ๊กเกอร์แจ้งเวลาขายเครื่องดื่มแอลกอฮอล์ที่กฎหมายกำหนด 4 ภาษา (ไทย/อังกฤษ/เกาหลี/ญี่ปุ่น)",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1Qifje7M9yoyvUZKPeeWJUiN74qjpdPQZjyhS7srTRxB36KIB3K3qqqAieCzATQhkk8q_U_gpxPHwybOQoAb8dS6Db-ywT6hZ51ymioQyWBFfKJ_8DviQd4f-ARLlWeNc66CmgKZ3x9qsF9VJ4ofPfFfA0ekxDUf531BDNLZ_mqTE1PInf_024t_gC3DDuZ8DAKYZMYHMN-BTAZ2hRb6k5ZkZUgCNYaJ32jsWHJj3yBQ=w260",
    "availableStock": 3000,
  },
  {
    "id": "mat-013",
    "title": "สติ๊กเกอร์ เวลาขายฯ ไทย/อังกฤษ/ลาว/พม่า",
    "category": "สติ๊กเกอร์ (Sticker)",
    "description": "สติ๊กเกอร์แจ้งเวลาขายเครื่องดื่มแอลกอฮอล์ที่กฎหมายกำหนด 4 ภาษา (ไทย/อังกฤษ/ลาว/พม่า)",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1Qifga2ngTI4QwfDxTKrPdW4KHyGXK2t_y3t1G7JvQj_aZ866CXgTNwyLm-5b37-jH330CDG7co7NAam7c4EqloUsQCxEYHl9AC1rXqssCNpcr3aI7UVJoNRMs8RtDXfZTAEgWux0TWQrM0rzXg2dnP0cfSZ_CpMSBBlF5FD1qlcKj_gIUC-vWNmsbSa7xh0l13wBOlAoQAjciSdjY55ZTqWfQ_a6uTW-rXWXSDqEbGw=w260",
    "availableStock": 3000,
  },
  {
    "id": "mat-014",
    "title": "สติ๊กเกอร์ สถานที่ห้ามขาย ห้ามดื่มฯ ไทย/อังกฤษ",
    "category": "สติ๊กเกอร์ (Sticker)",
    "description": "สติ๊กเกอร์แสดงสถานที่ห้ามขายและห้ามดื่มเครื่องดื่มแอลกอฮอล์ 2 ภาษา (ไทย/อังกฤษ)",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1Qifg2Ya7mlsKUkQPtwL4m1H2JUzboiYo_fZp6VbuB9GtYvJgLW7KJoCv1JW43iGLnBOGXrrk9MCoDDKi-wDivFZXSJObZKhtZcRNTydMguQzcjBP3P4yCrjeTeu0ltyhKkPYodEfuhxmtbY1abLi-s4VUkXOdUPBHYL-vXi3cOhV0_zttYR7xPVnbLbkpCKRickWhaADYS9JWz4uuShOn5rvq5TSenOHExGripXcx6Q=w260",
    "availableStock": 4000,
  },
  {
    "id": "mat-015",
    "title": "แผ่นพับ ประเมินอาการมึนเมาเบื้องต้น (3 ท่า)",
    "category": "แผ่นพับ (Brochure)",
    "description": "แผ่นพับแนะนำวิธีประเมินอาการมึนเมาเบื้องต้น 3 ท่า สำหรับผู้ประกอบการและเจ้าหน้าที่",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1QifjFSUppuU_9ieV-wwzYuSDmFO0gcbLXBS4K4cip6bVeGZXeEeILj9tp6QyxyctGODCoiEXiP_0toDl8mET97u_OE0p-2Q4udcFhbvm-99csDXfORsJVl3cE68XHbAmZKPsoH1hKJ9h7nntCdaj9xzHLLWB6g-qCKwW5XjwOWEz5I1nfmBFhD0JJvTqoUsgAgqkeHu0FP8UwBuUXOWJeLrFjMGk4_1XtynMUCo33Uw=w260",
    "availableStock": 5000,
  },
  {
    "id": "mat-016",
    "title": "แผ่นพับ ปริมาณการดื่มฯ กับผลกระทบต่อร่างกาย",
    "category": "แผ่นพับ (Brochure)",
    "description": "แผ่นพับให้ความรู้ปริมาณการดื่มแอลกอฮอล์กับผลกระทบต่อร่างกายในระดับต่างๆ",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1QifiljXmcaqz7zyR1Xtu5HeV37nj8Im_VXU7r18zURzIPceHt2cHrdH_m738DyDEchIboM7SJ-CVbt9bKbR4_5IJ1x5ZTGS4ro8nrpqiPqr9Vu8eqa7iqEAiJauRbPmyXzUK_ea2hdtK6_7JHav1XiF5RBIouSNASl_dulh2jGvBLyWkTQstNE_LEhkyIL-AuZsa5LO2wybA5wlwE1P0GpCWmW1uBbrZV3JrDdfMOeQ=w260",
    "availableStock": 5000,
  },
  {
    "id": "mat-017",
    "title": "แผ่นพับ คิดจะดื่ม...คิดจะขาย รู้กฎหมายยัง",
    "category": "แผ่นพับ (Brochure)",
    "description": "แผ่นพับสรุปข้อกฎหมายที่ผู้ดื่มและผู้ขายควรรู้ ตาม พ.ร.บ. ควบคุมเครื่องดื่มแอลกอฮอล์",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1QifhAoKbDoz0pPy42U7TWXoCXnTI8pc43gd4LvKGUH8WWOjz2e5zWObwVsBpXuo1tp4v0wQgT3P3ZZAIgpx5x01yEUgV1wMp5vkg_2kEhLgdrezoiQclNQg8mpGV9wgg_cacudm_4USg0QjoWL-HigCWsW9tgBnwLlBjpyO7j8HnwzCb9EdFlKvCR3Uy_MINe8g3-6yX0Xjh2s44LBS4RmasZ7OuNZrJIM8KYh40=w260",
    "availableStock": 5000,
  },
  {
    "id": "mat-018",
    "title": "แผ่นพับ โทษและพิษภัยต่อสุขภาพจากเครื่องดื่มแอลกอฮอล์",
    "category": "แผ่นพับ (Brochure)",
    "description": "แผ่นพับให้ความรู้โทษและพิษภัยต่อสุขภาพจากการดื่มเครื่องดื่มแอลกอฮอล์",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1QifixUpL5JJZyjVY8sCoNh0lOX6e4SLEviFFzRmnrctYrRHEeK6crdLL0TPdgoV0KlF4GhCpvnYa2kV_s7IgCn-_35IDWo13fjbekKnZALvMdbMxLsccqMMaJk2ZQgNA-oeB9S9gkOXaNbB-XBWvfb4AZc2iUqKolpqRnbKgKkeR71G08i7cq9QFiWMlhIiPkxxxDiDqqKdejbEUT_Jjq0CYvxnSuLWWnjLvk_XXCTw=w260",
    "availableStock": 5000,
  },
  {
    "id": "mat-019",
    "title": "โปสเตอร์ คิดจะดื่ม...คิดจะขาย รู้กฎหมายยัง",
    "category": "โปสเตอร์ (Poster)",
    "description": "โปสเตอร์สรุปข้อกฎหมายที่ผู้ดื่มและผู้ขายควรรู้ สำหรับติดหน้าร้านและบอร์ดประชาสัมพันธ์",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1Qifj2RgwO3QVbURsH2CHKOnDg4sEXLs6Ace_vhms017jAgLHHNjFJmv4zQrjI9wTFpacqFUzKTQ0oQkrkrecv0fLqHaKlwNCZiYCZa9Cikod-Y2VJBPItCbjbISOT0N6kafk32zFPTNrTsvq_BO25yM5bjoNhf6FJUwBDFEBQ-jBnu7lP2d3iCENaG9EgqAXaFdqAKDfNrPNUw3vt6bR0ImFmyyB7woFhupROVFc=w260",
    "availableStock": 3500,
  },
  {
    "id": "mat-020",
    "title": "โปสเตอร์ โทษและพิษภัยต่อสุขภาพจากเครื่องดื่มแอลกอฮอล์",
    "category": "โปสเตอร์ (Poster)",
    "description": "โปสเตอร์ให้ความรู้โทษและพิษภัยต่อสุขภาพ สำหรับติดบอร์ดในโรงเรียนและโรงพยาบาล",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1Qifhd1y47vLkrGL6QbJLac6usIIKf25su4YrVo33qMWm_jfHgHu09_I6U8CAFqBRnWIMKEevHiVuoPlCjkdvC4jSVXdl5zYSAhiP0bnnmNAt5gBvxbtxvPF0XiC0_r9WE1dk0QyB1gvHRBUF61RpV2CIHqb0ntP2kHkOTK5_f5o-il0tOLwhTI6Vz1PLlJxAA-XMfSbtHNF8oeZM72fxggv5xECHSzzFB5ZCKit7KUg=w260",
    "availableStock": 3500,
  },
  {
    "id": "mat-021",
    "title": "หนังสือ พ.ร.บ.ควบคุมเครื่องดื่มแอลกอฮอล์ พ.ศ.2551 และที่แก้ไขเพิ่มเติม",
    "category": "คู่มือ/หนังสือ (Handbook)",
    "description": "หนังสือรวมตัวบท พ.ร.บ. ควบคุมเครื่องดื่มแอลกอฮอล์ พ.ศ. 2551 และฉบับแก้ไขเพิ่มเติม",
    "maxAllowed": 50,
    "imageUrl": "https://docs.google.com/forms-images-rt/AI1Qifji7lm_U-WcYkc8Jq5xjyIRjix1aWctMP63FUyZOomlAEwIfZAwtJD_cl470kVxRxRdIZ79q9CVW2GpKudJYpQgp56e4IUIF9pKcJQVjQ2m2MeNaCravFtkkKB0AnRsC2ke6bjJo225ojOl-lVmMYtll4hSsZJkgjQcO6uI7FLkK3QJoqdx9rtA-Bca9tj4Zl_Vr0nujtiMfKnYRRGs2QGTGXqjwpDjOdAAS0r0EQ=w260",
    "availableStock": 1200,
  }
];

/* คำขอตัวอย่างเริ่มต้นสำหรับหลังบ้าน (SEED_REQUESTS) */
export const SEED_REQUESTS: SubmittedRequest[] = [
  {
    "id": "req-1",
    "refNumber": "ALC-2569-4821",
    "submittedAt": "22 ก.ค. 09:14",
    "submittedAtISO": "2026-07-22T09:14:00",
    "fullName": "นางสาวปรียา วงศ์ทอง",
    "agencyName": "รพ.สต. บ้านหนองไผ่",
    "phoneNumber": "081-234-5678",
    "requiredDate": "2026-08-05",
    "shippingAddress": "99 ม.4 ต.หนองไผ่ อ.เมือง จ.ขอนแก่น 40000",
    "purpose": "จัดบูธรณรงค์งดเหล้าเข้าพรรษา",
    "selectedMaterials": [
      {
        "materialId": "mat-001",
        "quantity": 30
      },
      {
        "materialId": "mat-003",
        "quantity": 20
      }
    ],
    "status": "รอการอนุมัติ"
  },
  {
    "id": "req-2",
    "refNumber": "ALC-2569-4790",
    "submittedAt": "21 ก.ค. 15:02",
    "submittedAtISO": "2026-07-21T15:02:00",
    "fullName": "นายวิชัย สุขสมบูรณ์",
    "agencyName": "สสอ. เมืองระยอง",
    "phoneNumber": "089-556-1200",
    "requiredDate": "2026-07-30",
    "shippingAddress": "12 ถ.สุขุมวิท ต.ท่าประดู่ อ.เมือง จ.ระยอง 21000",
    "purpose": "อบรมผู้ประกอบการร้านค้า",
    "selectedMaterials": [
      {
        "materialId": "mat-002",
        "quantity": 40
      }
    ],
    "status": "กำลังจัดส่ง"
  },
  {
    "id": "req-3",
    "refNumber": "ALC-2569-4715",
    "submittedAt": "19 ก.ค. 10:45",
    "submittedAtISO": "2026-07-19T10:45:00",
    "fullName": "นางมาลี ทองดี",
    "agencyName": "โรงเรียนบ้านคลองใหญ่",
    "phoneNumber": "084-991-2233",
    "requiredDate": "2026-07-25",
    "shippingAddress": "5 ม.2 ต.คลองใหญ่ อ.แหลมงอบ จ.ตราด 23120",
    "purpose": "ติดบอร์ดให้ความรู้นักเรียน",
    "selectedMaterials": [
      {
        "materialId": "mat-005",
        "quantity": 15
      },
      {
        "materialId": "mat-004",
        "quantity": 10
      }
    ],
    "status": "เสร็จสิ้น"
  },
  {
    "id": "req-4",
    "refNumber": "ALC-2569-4680",
    "submittedAt": "18 ก.ค. 08:20",
    "submittedAtISO": "2026-07-18T08:20:00",
    "fullName": "นายสมศักดิ์ ใจงาม",
    "agencyName": "อบต. หนองปลาไหล",
    "phoneNumber": "086-778-4510",
    "requiredDate": "2026-08-12",
    "shippingAddress": "200 ม.7 ต.หนองปลาไหล อ.เมือง จ.สระบุรี 18000",
    "purpose": "จัดกิจกรรมวันสำคัญทางศาสนา",
    "selectedMaterials": [
      {
        "materialId": "mat-006",
        "quantity": 50
      }
    ],
    "status": "รอการอนุมัติ"
  }
];
