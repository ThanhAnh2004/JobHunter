import React, { useState } from 'react';
import { Modal, Form, InputNumber, Radio, Button, Row, Col, Card, Typography, Divider } from 'antd';
import { CalculatorOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface GrossNetModalProps {
    open: boolean;
    onClose: () => void;
}

export const GrossNetModal: React.FC<GrossNetModalProps> = ({ open, onClose }) => {
    const [salaryInput, setSalaryInput] = useState<number>(25000000);
    const [salaryType, setSalaryType] = useState<'GROSS_TO_NET' | 'NET_TO_GROSS'>('GROSS_TO_NET');
    const [dependents, setDependents] = useState<number>(0);
    const [insuranceSalary] = useState<number | null>(null);

    // Kết quả tính toán
    const [result, setResult] = useState<any>(null);

    // Mức lương cơ sở: 2,340,000 (từ 01/07/2024)
    // Lương đóng tối đa BHXH, BHYT = 20 * 2,340,000 = 46,800,000
    // Lương tối thiểu vùng 1 = 4,960,000 (từ 01/07/2024)
    // Lương đóng tối đa BHTN = 20 * 4,960,000 = 99,200,000
    const MAX_BHXH_BHYT = 46800000;
    const MAX_BHTN = 99200000;
    const PERSONAL_DEDUCTION = 11000000; // 11 triệu
    const DEPENDENT_DEDUCTION = 4400000; // 4.4 triệu / người

    const calculateGrossToNet = (gross: number, numDependents: number, customInsSalary: number | null) => {
        const baseIns = customInsSalary ? customInsSalary : gross;
        
        // Tính bảo hiểm người lao động đóng
        const bhxhSalary = Math.min(baseIns, MAX_BHXH_BHYT);
        const bhtnSalary = Math.min(baseIns, MAX_BHTN);

        const bhxh = bhxhSalary * 0.08; // 8%
        const bhyt = bhxhSalary * 0.015; // 1.5%
        const bhtn = bhtnSalary * 0.01; // 1%
        const totalInsurance = bhxh + bhyt + bhtn;

        // Thu nhập trước thuế
        const incomeBeforeTax = gross - totalInsurance;

        // Giảm trừ gia cảnh
        const totalDeduction = PERSONAL_DEDUCTION + (numDependents * DEPENDENT_DEDUCTION);

        // Thu nhập chịu thuế
        const taxableIncome = Math.max(0, incomeBeforeTax - totalDeduction);

        // Tính thuế TNCN theo biểu thuế lũy tiến từng phần
        let tax = 0;
        if (taxableIncome <= 5000000) {
            tax = taxableIncome * 0.05;
        } else if (taxableIncome <= 10000000) {
            tax = (taxableIncome * 0.1) - 250000;
        } else if (taxableIncome <= 18000000) {
            tax = (taxableIncome * 0.15) - 750000;
        } else if (taxableIncome <= 32000000) {
            tax = (taxableIncome * 0.2) - 1650000;
        } else if (taxableIncome <= 52000000) {
            tax = (taxableIncome * 0.25) - 3250000;
        } else if (taxableIncome <= 80000000) {
            tax = (taxableIncome * 0.3) - 5850000;
        } else {
            tax = (taxableIncome * 0.35) - 9850000;
        }

        const net = gross - totalInsurance - tax;

        return {
            gross,
            net: Math.round(net),
            bhxh: Math.round(bhxh),
            bhyt: Math.round(bhyt),
            bhtn: Math.round(bhtn),
            totalInsurance: Math.round(totalInsurance),
            incomeBeforeTax: Math.round(incomeBeforeTax),
            totalDeduction: Math.round(totalDeduction),
            taxableIncome: Math.round(taxableIncome),
            tax: Math.round(tax)
        };
    };

    const handleCalculate = () => {
        if (!salaryInput || salaryInput <= 0) return;
        
        if (salaryType === 'GROSS_TO_NET') {
            const res = calculateGrossToNet(salaryInput, dependents, insuranceSalary);
            setResult(res);
        } else {
            // NET to GROSS (Dò nghiệm nhị phân xấp xỉ)
            let low = salaryInput;
            let high = salaryInput * 2;
            let ansGross = salaryInput;

            for (let i = 0; i < 50; i++) {
                const mid = (low + high) / 2;
                const calc = calculateGrossToNet(mid, dependents, insuranceSalary);
                if (Math.abs(calc.net - salaryInput) < 10) {
                    ansGross = mid;
                    break;
                }
                if (calc.net < salaryInput) {
                    low = mid;
                } else {
                    high = mid;
                }
                ansGross = mid;
            }
            const finalRes = calculateGrossToNet(ansGross, dependents, insuranceSalary);
            setResult(finalRes);
        }
    };

    const formatCurrency = (val: number) => {
        return (val || 0).toLocaleString('vi-VN') + ' đ';
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            width={850}
            footer={null}
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                    <CalculatorOutlined style={{ color: '#16a34a', fontSize: 22 }} />
                    Công Cụ Tính Lương GROSS ⇄ NET Chuẩn 2026
                </div>
            }
            destroyOnClose
        >
            <div style={{ marginTop: 16 }}>
                <Row gutter={[20, 20]}>
                    <Col span={24} md={12}>
                        <Card size="small" style={{ background: '#f8fafc', borderRadius: 10 }}>
                            <Form layout="vertical">
                                <Form.Item label={<span style={{ fontWeight: 600 }}>Bạn muốn quy đổi từ:</span>}>
                                    <Radio.Group 
                                        value={salaryType} 
                                        onChange={e => setSalaryType(e.target.value)}
                                        buttonStyle="solid"
                                    >
                                        <Radio.Button value="GROSS_TO_NET">GROSS ➔ NET</Radio.Button>
                                        <Radio.Button value="NET_TO_GROSS">NET ➔ GROSS</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item 
                                    label={<span style={{ fontWeight: 600 }}>Thu nhập ({salaryType === 'GROSS_TO_NET' ? 'Lương GROSS' : 'Lương NET'}):</span>}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        size="large"
                                        value={salaryInput}
                                        onChange={val => setSalaryInput(val || 0)}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                                        addonAfter="VNĐ"
                                    />
                                </Form.Item>

                                <Form.Item label={<span style={{ fontWeight: 600 }}>Số người phụ thuộc:</span>}>
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={0}
                                        max={10}
                                        value={dependents}
                                        onChange={val => setDependents(val || 0)}
                                        addonAfter="Người (Giảm trừ 4.4 tr/người)"
                                    />
                                </Form.Item>

                                <Button 
                                    type="primary" 
                                    size="large" 
                                    block 
                                    style={{ background: '#16a34a', borderColor: '#16a34a', fontWeight: 600, height: 44 }}
                                    onClick={handleCalculate}
                                >
                                    Tính Lương Ngay
                                </Button>
                            </Form>
                        </Card>
                    </Col>

                    <Col span={24} md={12}>
                        {result ? (
                            <Card 
                                size="small" 
                                style={{ 
                                    borderRadius: 10, 
                                    border: '1px solid #bbf7d0', 
                                    background: '#f0fdf4' 
                                }}
                            >
                                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                                    <Text style={{ fontSize: 13, color: '#15803d', textTransform: 'uppercase', fontWeight: 600 }}>
                                        {salaryType === 'GROSS_TO_NET' ? 'Lương Thực Nhận (NET)' : 'Lương Ký Hợp Đồng (GROSS)'}
                                    </Text>
                                    <div style={{ fontSize: 30, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>
                                        {formatCurrency(salaryType === 'GROSS_TO_NET' ? result.net : result.gross)}
                                    </div>
                                </div>

                                <Divider style={{ margin: '12px 0' }} />

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Lương GROSS:</span>
                                        <strong>{formatCurrency(result.gross)}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                                        <span>Bảo hiểm bắt buộc (10.5%):</span>
                                        <span>- {formatCurrency(result.totalInsurance)}</span>
                                    </div>
                                    <div style={{ paddingLeft: 12, fontSize: 12, color: '#64748b' }}>
                                        <div>• BHXH (8%): - {formatCurrency(result.bhxh)}</div>
                                        <div>• BHYT (1.5%): - {formatCurrency(result.bhyt)}</div>
                                        <div>• BHTN (1%): - {formatCurrency(result.bhtn)}</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Thu nhập trước thuế:</span>
                                        <strong>{formatCurrency(result.incomeBeforeTax)}</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                                        <span>Giảm trừ gia cảnh:</span>
                                        <span>- {formatCurrency(result.totalDeduction)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                                        <span>Thuế TNCN:</span>
                                        <span>- {formatCurrency(result.tax)}</span>
                                    </div>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, color: '#15803d' }}>
                                        <span>Lương NET:</span>
                                        <span>{formatCurrency(result.net)}</span>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <div style={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                padding: 30,
                                background: '#f8fafc',
                                borderRadius: 10,
                                textAlign: 'center',
                                border: '1px dashed #cbd5e1'
                            }}>
                                <CalculatorOutlined style={{ fontSize: 42, color: '#94a3b8', marginBottom: 12 }} />
                                <Paragraph style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
                                    Nhập mức thu nhập của bạn và nhấn <strong>"Tính Lương Ngay"</strong> để xem chi tiết các khoản khấu trừ bảo hiểm & thuế TNCN.
                                </Paragraph>
                            </div>
                        )}
                    </Col>
                </Row>

                <div style={{ marginTop: 20, padding: 12, background: '#eff6ff', borderRadius: 8, border: '1px solid #dbeafe', fontSize: 12, color: '#1e40af' }}>
                    <InfoCircleOutlined style={{ marginRight: 6 }} />
                    <strong>Căn cứ pháp lý:</strong> Áp dụng mức giảm trừ gia cảnh 11.000.000đ/tháng cho bản thân và 4.400.000đ/tháng cho mỗi người phụ thuộc theo quy định mới nhất của Bộ Tài chính.
                </div>
            </div>
        </Modal>
    );
};

export default GrossNetModal;
