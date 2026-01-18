import AsyncSelect from 'react-select/async';
import { api } from '../../../api/axios'; // Using your Axios instance
import { type DestinationOption } from '../../../types/index';

interface NominatimResponse {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

interface Props {
    onSelect: (dest: DestinationOption) => void;
    isLoading?: boolean;
}

export const DestinationSearch = ({ onSelect, isLoading }: Props) => {
    const loadOptions = async (inputValue: string): Promise<DestinationOption[]> => {
        if (!inputValue || inputValue.length < 3) return [];

        try {
            const { data } = await api.get<NominatimResponse[]>(
                `https://nominatim.openstreetmap.org/search`, {
                    params: {
                        q: inputValue,
                        format: 'json',
                        addressdetails: 1,
                        limit: 5,
                        countrycodes: 'eg'
                    }
                }
            );

            return data.map((item) => ({
                value: item.place_id.toString(),
                label: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon)
            }));
        } catch (error) {
            console.error("Geocoding error:", error);
            return [];
        }
    };

    return (
        <div className="w-full shadow-2xl">
            <AsyncSelect<DestinationOption>
                cacheOptions
                loadOptions={loadOptions}
                placeholder="Search Destination in Egypt..."
                onChange={(opt) => opt && onSelect(opt)}
                isDisabled={isLoading}
                styles={customStyles}
            />
        </div>
    );
};

// 🎨 Dark Theme Styling to match your Slate dashboard
const customStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: '#1e293b', // slate-800
    borderColor: '#334155',     // slate-700
    borderRadius: '1rem',
    padding: '0.5rem',
    color: 'white',
    boxShadow: 'none',
    '&:hover': { borderColor: '#475569' }
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#1e293b',
    borderRadius: '1rem',
    overflow: 'hidden',
    marginTop: '8px'
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? '#334155' : 'transparent',
    color: state.isFocused ? '#60a5fa' : '#cbd5e1',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '12px'
  }),
  input: (base: any) => ({ ...base, color: 'white' }),
  singleValue: (base: any) => ({ ...base, color: 'white' }),
};