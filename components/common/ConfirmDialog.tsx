import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    content: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, title, content, onConfirm, onCancel }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <p>{content}</p>
                <DialogFooter>
                    <Button variant="destructive" onClick={onConfirm}>
                        Xác nhận
                    </Button>
                    <Button variant="outline" onClick={onCancel}>
                        Hủy
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
