'use client';

import React, {useState} from 'react';
import {ConfirmDialog} from './ConfirmDialog';
import {useChangeStatus} from '@/hooks/useChangeStatus';
import {Button} from '@/components/ui/button';
import {Status} from '@/lib/types/enumStatus';

export const StatusChanger: React.FC<{ id: string; status: number, table: string, onSuccess?: () => void, icon?: React.ReactNode }> = ({id, status, table, onSuccess, icon}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {updateStatus, isLoading} = useChangeStatus();

    const handleConfirm = async () => {
        await updateStatus({id, status, table});
        setIsDialogOpen(false);
        if (onSuccess) {
            onSuccess();
        }
    };

    const getDialogContent = () => {
        switch(status) {
            case Status.ACTIVE:
                return {
                    title: "Xác nhận vô hiệu hóa",
                    content: "Bạn có chắc chắn muốn vô hiệu hóa mục này không?"
                };
            case Status.INACTIVE:
                return {
                    title: "Xác nhận kích hoạt",
                    content: "Bạn có chắc chắn muốn kích hoạt mục này không?"
                };
            case Status.PENDING:
                return {
                    title: "Xác nhận phê duyệt",
                    content: "Bạn có chắc chắn muốn phê duyệt mục này không?"
                };
            default:
                return {
                    title: "Xác nhận xóa",
                    content: "Bạn có chắc chắn muốn xóa mục này không? Thao tác này không thể hoàn tác."
                };
        }
    };

    const dialogContent = getDialogContent();

    return (
        <>
            <Button onClick={() => setIsDialogOpen(true)} disabled={isLoading}>
                {icon}
                {!icon && (status === Status.ACTIVE ? 'Vô hiệu hóa' : 
                 status === Status.INACTIVE ? 'Kích hoạt' :
                 status === Status.PENDING ? 'Phê duyệt' : 'Xóa')}
            </Button>
            <ConfirmDialog
                isOpen={isDialogOpen}
                title={dialogContent.title}
                content={dialogContent.content}
                onConfirm={handleConfirm}
                onCancel={() => setIsDialogOpen(false)}
            />
        </>
    );
};
