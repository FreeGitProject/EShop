import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import BulkImport from "../../components/Shop/BulkImport.jsx";

const ShopBulkImportPage = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                  <DashboardSideBar active={14} />
                </div>
                <div className="w-full justify-center flex">
                    <BulkImport />
                </div>
              </div>
        </div>
      )
}

export default ShopBulkImportPage
