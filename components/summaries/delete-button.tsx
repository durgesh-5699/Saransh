import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

export default function DeleteButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          size="icon"
          className="text-gray-400 bg-gray-50 border border-gray-200 hover:text-rose-600 hover:bg-rose-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Summary</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this summary?
            This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button
                variant={'ghost'}
                className=" bg-gray-50 border border-gray-200 hover:text-gray-600 hover:bg-gray-100"
                >
                Cancel
            </Button>
             <Button
                variant={'destructive'}
                className=" bg-gray-900  hover:bg-gray-600"
                >
                Delete
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}