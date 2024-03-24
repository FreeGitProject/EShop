import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import CreateCategory from "../../components/Shop/CreateCategory.jsx";

const ShopCreateCategoryPage = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                  <DashboardSideBar active={13} />
                </div>
                <div className="w-full justify-center flex">
                    <CreateCategory />
                </div>
              </div>
        </div>
      )
}

export default ShopCreateCategoryPage
