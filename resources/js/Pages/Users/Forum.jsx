import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { 
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
  useDisclosure, Checkbox, Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, 
  Textarea
} from '@nextui-org/react'; // NextUI components
import SearchBar from '@/Components/SearchBar'; // Custom SearchBar


export default function Forum({ auth }) {
  const isAuthenticated = !!auth.user;
  const MainLayout = isAuthenticated ? AuthenticatedLayout : GuestLayout;

  // State for sort dropdown
  const [selectedSortOption, setSelectedSortOption] = useState('Sort by');
  
  const handleSort = (option) => {
    setSelectedSortOption(option); // Update sort option
    console.log('Selected sort option:', option);
  };

  // Modal state management using NextUI
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <MainLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between px-6">
          
          {/* Buttons beside the Forum Title */}
          <div className="flex items-center space-x-4">
            
          </div>
        </div>
      }
    >
      <Head title="Forum" />

      <div className="py-12 min-h-screen">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 font-bold text-xl text-black">

             

               {/* Sort Dropdown and Search Bar */}
               <div className="flex items-center space-x-4 justify-between">

                 {/* Forum Title */}
              <div className="mb-4">
                <h2 className="font-semibold text-4xl text-gray-800 leading-tight">Forum</h2>
              </div>
                <Dropdown>
                  <DropdownTrigger>
                    <Button className="bg-customBlue w-56 text-white" variant="solid" >{selectedSortOption}</Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Sort options">
                    <DropdownItem key="latest" onClick={() => handleSort('Latest')}>
                      Latest
                    </DropdownItem>
                    <DropdownItem key="oldest" onClick={() => handleSort('Oldest')}>
                      Oldest
                    </DropdownItem>
                    <DropdownItem key="popular" onClick={() => handleSort('Most Popular')}>
                      Most Popular
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <SearchBar placeholder="Search..." />

                <div className="ml-auto">
                <Button radius="full" className="bg-gradient-to-r from-sky-400 to-blue-800 text-white w-60" 
                onClick={onOpen}
                >
                  Start Discussion
                </Button>
                </div>
              </div>

              <div className='flex flex-row mt-8'>

              {/* Buttons Below the Forum Title */}
              <div className="flex flex-col items-start gap-4 mb-6">
                <Button variant="bordered"  className="bg-customBlue text-white w-auto min-w-[140px]">
                  All Discussions
                </Button>
                <Button variant="bordered" className="bg-customBlue text-white w-auto min-w-[100px]">
                  Title Suggestions
                </Button>
              </div>

              <div className='flex flex-col m-3'>
                hello
              </div>

              </div>

             
            </div>
          </div>
        </div>
      </div>

      {/* Modal (NextUI Modal) */}
      <Modal 
        className="max-w-3xl"
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Add Discussion</ModalHeader>
          <ModalBody>
            <Input
          
              label="Title"
              placeholder="Enter Discussion Title"
              variant="bordered"
              autoFocus={false}
            />
            <Textarea
              
              label="Body"
              placeholder="Tell us more about your discussion"
              variant="bordered"
              className=""
              autoFocus={false}

            />
            <Input
          
              label="Tags"
              placeholder="Add up to 5 tags to describe what your discussion is about"
              variant="bordered"
              autoFocus={false}
             />
            

           
            <div className="flex py-2 px-1 justify-between">
              <Checkbox classNames={{ label: "text-small" }}>
                I have reviewed and verified each file I am uploading. I have the right to share each file publicly and/or store a private copy accessible to me and the co-authors, as applicable. By uploading this file, I agree to the Upload Conditions.
              </Checkbox>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onOpenChange}>
              Cancel
            </Button>
            <Button color="primary" onPress={onOpenChange}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}
