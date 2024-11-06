
import  './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/dailyspecials' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Daily Specials</p>
        </NavLink>
        <NavLink to='/listSandwich' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Sandwiches</p>
        </NavLink>
        <NavLink to='/listDishComponents' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Dish components</p>
        </NavLink>
        <NavLink to='/listReservations' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Resrvations</p>
        </NavLink>
        <NavLink to='/result' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Result</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar ;
